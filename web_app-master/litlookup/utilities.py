import time

import faiss
import numpy as np
import pandas as pd
import torch
from sentence_transformers import SentenceTransformer, util


def load_bert_model():
    """Instantiate a sentence-level DistilBERT model."""
    return SentenceTransformer('msmarco-distilbert-base-dot-prod-v3')
    print('model loaded')


def load_abstract_index():
    return faiss.read_index('similarity/resources/articles_abstract_only.index')
    print('index loaded')


def read_data(path):
    return pd.read_json(path)
    print('articles loaded')


def load_papers():
    file = 'similarity/resources/process_w_abstract.json'
    print('articles loaded')
    return pd.read_json(file)


def fetch_article_info(dataframe_idx, df):
    info = df.iloc[dataframe_idx]
    meta_dict = dict()
    meta_dict['title'] = info['title']
    meta_dict['description'] = info['description']
    meta_dict['doi'] = info['doi']
    meta_dict['author_count'] = info['author_count']
    meta_dict['author_names'] = info['author_names']
    meta_dict['authkeywords'] = info['authkeywords']
    return meta_dict


def search(query, top_k, index, model, df):
    t = time.time()
    query_vector = model.encode([query])
    top_k = index.search(query_vector, top_k)
    print('>>>> Results in Total Time: {}'.format(time.time() - t))
    top_k_ids = top_k[1].tolist()[0]
    top_k_ids = list(np.unique(top_k_ids))
    results = [fetch_article_info(idx, df) for idx in top_k_ids]
    title_array = [t['title'] for t in results]
    print(title_array)
    return results, title_array, time.time() - t


def search_papers(title, abstract, model, corpus_embeddings):
    # check empty
    if len(title) == 0:
        title = ' '
    if len(abstract) == 0:
        abstract = 'investigate'
    # load corpus method too
    query_embedding = model.encode(title + '[SEP]' + abstract, convert_to_tensor=True)

    search_hits = util.semantic_search(query_embedding, corpus_embeddings)
    return search_hits

