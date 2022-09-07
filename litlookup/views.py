from django.shortcuts import render
from django.db.models import Max
from .models import Article
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .forms import articleFilterForm
from searchmodel.apps import WebappConfig
from sentence_transformers import util, SentenceTransformer
import faiss
import pandas as pd
import torch
import time
import numpy as np
import sys
from litlookup.utilities import *





def index(request):
    num_articles = Article.objects.all().count()
    last_updated = Article.objects.all().aggregate(Max('last_updated')).get('last_updated__max')
    num_sources = len(Article.objects.order_by().values('publicationName').distinct())
    subtypes = list((Article.objects.order_by('subtypeDescription').exclude(
        subtypeDescription__isnull=True).values_list('subtypeDescription', 'subtypeDescription').distinct()))
    subtypes = sorted([('', 'All')] + subtypes, key=lambda tup: tup[1])
    page = request.GET.get('page', 1)

    search_kw = request.GET.get('kw_search')
    subtype = request.GET.get('subtype')
    article_res = Article.objects.all()
    if search_kw:
        response = WebappConfig.model.encode([search_kw])
        index1 = faiss.read_index('searchmodel/model/articles_abstract_only2.index')

        D, I = index1.search(response, 10000)
        print(I)
        l = [i for i in I[0] if i != -1]

        print(index1.ntotal)
        results = WebappConfig.articles.iloc[list(set(l))].reset_index()
        results.drop(['index', 'Unnamed: 0', 'N/A', 'N/A.1', 'clusters', 'text', 'abslen'], axis = 'columns', inplace=True)

        # print('RESULT DF', results)
        # print('RESULT DF', type(results))
        # print(results.keys())
        # print(results.title.tolist())

        title_list = results.title.tolist()

        print(title_list)

        # article_res = article_res.filter(description__icontains=search_kw)
        article_res = article_res.filter(title__in=title_list)
        # query_set = [Article(**vals) for vals in results.to_dict(orient='records')]
        # print('QUERY SET:', type(query_set))
    if subtype is not None and subtype != '':
        article_res = article_res.filter(subtypeDescription=subtype)

    print('ARTICLE RES:', type(article_res))

    num_res = article_res.count()
    paginator = Paginator(article_res, 10)
    page_range = paginator.get_elided_page_range(number=page, on_each_side=3, on_ends=2)
    try:
        articles = paginator.page(page)
    except PageNotAnInteger:
        articles = paginator.page(1)
    except EmptyPage:
        articles = paginator.page(paginator.num_pages)

    form = articleFilterForm(subtype_choices=subtypes)
    form.fields['kw_search'].widget.attrs['value'] = search_kw if search_kw else ''
    form.fields['subtype'].initial = subtype
    print(type(articles))
    context = {
        'num_articles': num_articles,
        'last_updated': last_updated,
        'num_sources': num_sources,
        'articles': articles,
        'page_range': page_range,
        'search_kw': search_kw,
        'subtype': subtype,
        'num_res': num_res,
        'form': form
    }
    return render(request, 'index.html', context=context)


