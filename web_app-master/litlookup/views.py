from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.db.models import Max
from django.core import serializers
import json
from json import loads as jloads

from litlookup.apps import SemanticSearchConfig
from .models import Article
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .forms import articleFilterForm
# from searchmodel.apps import WebappConfig
from sentence_transformers import util, SentenceTransformer
import faiss
import pandas as pd
import torch
import time
import numpy as np
import sys
import re
from litlookup.utilities import *
import csv


# from authkeywords import subcat_unify


def index(request):
    print(request)
    num_articles = Article.objects.all().count()
    last_updated = Article.objects.all().aggregate(Max('last_updated')).get('last_updated__max')
    num_sources = len(Article.objects.order_by().values('publicationName').distinct())

    # response of db basic info
    detail_only = request.GET.get('detail')
    if detail_only == "1":
        print("1")
        response = {
            'num_articles': num_articles,
            'last_updated': last_updated,
            'num_sources': num_sources,
        }
        return JsonResponse(response)

    subtypes = list((Article.objects.order_by('subtypeDescription').exclude(
        subtypeDescription__isnull=True).values_list('subtypeDescription', 'subtypeDescription').distinct()))
    subtypes = sorted([('', 'All')] + subtypes, key=lambda tup: tup[1])
    page = request.GET.get('page', 1)

    search_kw = request.GET.get('kw_search')
    subtype = request.GET.get('subtype')
    article_res = Article.objects.all()
    if search_kw:
        response = SemanticSearchConfig.model.encode([search_kw])
        index1 = faiss.read_index('litlookup/model/articles_abstract_only.index')
        index1.nprobe = 10
        _, I = index1.search(response, 100)
        l = list(set(I[0]))
        # print(max(l))
        # print(SemanticSearchConfig.articles.shape)
        # print(SemanticSearchConfig.articles.iloc[list(set(l))])
        # print(index1.ntotal)
        results = SemanticSearchConfig.articles.iloc[l].reset_index()

        results.drop(['index', 'Unnamed: 0', 'N/A', 'N/A.1', 'clusters', 'text', 'abslen'], axis='columns',
                     inplace=True)

        # print('RESULT DF', results)Object.keys(articlesByCat)
        # print('RESULT DF', type(results))
        # print(results.keys())
        # print(results.title.tolist())

        title_list = results.title.tolist()

        # print(title_list)

        # article_res = article_res.filter(description__icontains=search_kw)
        article_res = article_res.filter(title__in=title_list)
        # query_set = [Article(**vals) for vals in results.to_dict(orient='records')]
        # print('QUERY SET:', type(query_set))
    if subtype is not None and subtype != '':
        article_res = article_res.filter(subtypeDescription=subtype)

    # print('ARTICLE RES:', type(article_res))

    num_res = article_res.count()
    # paginator = Paginator(article_res, 10)
    # page_range = paginator.get_elided_page_range(number=page, on_each_side=3, on_ends=2)
    # try:
    #     articles = paginator.page(page)
    # except PageNotAnInteger:
    #     articles = paginator.page(1)
    # except EmptyPage:
    #     articles = paginator.page(paginator.num_pages)

    form = articleFilterForm(subtype_choices=subtypes)
    form.fields['kw_search'].widget.attrs['value'] = search_kw if search_kw else ''
    form.fields['subtype'].initial = subtype
    articles_json = jloads(serializers.serialize('json', article_res))

    # response for data visualization

    data_vis1 = request.GET.get('data_vis1')
    data_vis2 = request.GET.get('data_vis2')
    data_vis3 = request.GET.get('data_vis3')
    # 1: get the article count per year on search
    # and article count per cluster on search
    if data_vis1 == "1":
        article_by_year = {}
        for article in articles_json:
            date = article["fields"]["coverDate"]
            year = re.search("^[0-9][0-9][0-9][0-9]", date).group()
            if year in article_by_year:
                article_by_year[year] += 1
            else:
                article_by_year[year] = 1

        article_by_year_json = json.loads(json.dumps(article_by_year))
        response = {
            'articles_by_year': article_by_year_json
        }
        return JsonResponse(response)

    # 2: get article count per category on search
    if data_vis2 == "1":

        article_by_category = {}
        for article in articles_json:
            subcat = article["fields"]["clusters"]
            if subcat is None or subcat == "":
                subcat_list = ["other"]
            else:
                subcat_list = subcat.split(";")
            cluster_temp = []
            for cat in subcat_list:
                # cat = subcat_unify(cat)
                if cat not in cluster_temp:
                    cluster_temp.append(cat)

            for cluster in cluster_temp:
                if cluster in article_by_category:
                    article_by_category[cluster] += 1
                else:
                    article_by_category[cluster] = 1

        article_by_cat_json = json.loads(json.dumps(article_by_category))
        response = {
            'article_by_category': article_by_cat_json
        }
        return JsonResponse(response)

    # 3: get db total article count on sub category and year
    if data_vis3 == "1":

        article_by_year_category = {}
        article_by_category_year = {}

        # hard code category and year list for front end data visualization
        categoryList = ["Business Finance", "Computer Crimes", "Cryptography", "Cyber Risk Assessment",
                        "Decentralized Systems", "Decision Mangement and Public Policy", "Digital Governance",
                        "Energy", "Healthcare", "Management", "Security and Defense", "Security and Resilience",
                        "Smart City", "Telecommunications and Internet of Things", "other"]
        yearList = []
        for i in range(1999, 2023):
            yearList.append(str(i))

        for year in yearList:
            article_by_category_year[year] = {}
            for cat in categoryList:
                article_by_category_year[year][cat] = 0

        for cat in categoryList:
            article_by_year_category[cat] = {}
            for year in yearList:
                article_by_year_category[cat][year] = 0

        for article in articles_json:
            subcat = article["fields"]["clusters"]
            date = article["fields"]["coverDate"]
            year = re.search("^[0-9][0-9][0-9][0-9]", date).group()
            if subcat is None or subcat == "":
                subcat_list = ["other"]
            else:
                subcat_list = subcat.split(";")
            cluster_temp = []
            for cat in subcat_list:
                if cat not in cluster_temp:
                    cluster_temp.append(cat)

            for cluster in cluster_temp:
                # if year not in article_by_category_year:
                #     article_by_category_year[year] = {}
                #     article_by_category_year[year][cluster] = 1
                # if cluster in article_by_category_year[year]:
                #     article_by_category_year[year][cluster] += 1
                # else:
                #     article_by_category_year[year][cluster] = 1

                # if cluster not in article_by_year_category:
                #     article_by_year_category[cluster] = {}
                #     article_by_year_category[cluster][year] = 1
                # if year in article_by_year_category[cluster]:
                #     article_by_year_category[cluster][year] += 1
                # else:
                #     article_by_year_category[cluster][year] = 1
                article_by_category_year[year][cluster] += 1
                article_by_year_category[cluster][year] += 1

        article_by_cat_year_json = json.loads(json.dumps(article_by_category_year))
        article_by_year_cat_json = json.loads(json.dumps(article_by_year_category))
        response = {
            'article_by_year_category': article_by_year_cat_json,
            'article_by_category_year': article_by_cat_year_json
        }
        return JsonResponse(response)

    response = {
        'num_articles': num_articles,
        'last_updated': last_updated,
        'num_sources': num_sources,
        'search_kw': search_kw,
        'subtype': subtype,
        'num_res': num_res,
        'articles': articles_json
    }
    return JsonResponse(response)


def subcat_unify(subcat, clusters):
    subcat = re.sub(" \(.+\)", "", subcat)
    subcat = re.sub(" ", "_", subcat)
    subcat = re.sub("-", "_", subcat)
    subcat = subcat.lower()

    # for cluster in clusters:

    return subcat
