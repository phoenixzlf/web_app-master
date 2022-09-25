from fastapi import Depends, FastAPI
from sentence_transformers import util, SentenceTransformer
from pydantic import BaseModel
import pandas as pd


class ArticleRetrieval(BaseModel):
    articles: List[Article]


class Article:
    title = ""
