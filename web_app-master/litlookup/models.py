# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class Article(models.Model):
    eid = models.CharField(max_length=100, default='')
    doi = models.CharField(primary_key=True, max_length=100, default='', help_text='Digital Object Identifier')
    pii = models.CharField(max_length=100, default='')
    pubmed_id = models.CharField(max_length=100, default='')
    title = models.CharField(max_length=1000, default='', help_text='Title')
    subtype = models.CharField(max_length=10, default='')
    subtypeDescription = models.CharField(max_length= 20, default='', help_text='Article Type')
    creator = models.CharField(max_length=20, default='')
    afid = models.CharField(max_length=100, default='')
    affilname= models.CharField(max_length=1000, default='')
    affiliation_city = models.CharField(max_length=1000, default='')
    affiliation_country = models.CharField(max_length=500, default='')
    author_count = models.CharField(max_length=5, default='')
    author_names = models.CharField(max_length=1000, default='')
    author_ids = models.CharField(max_length=1000, default='')
    author_afids = models.CharField(max_length=1000, default='')
    coverDate = models.CharField(max_length= 20, default='')   
    coverDisplayDate =models.CharField(max_length=50, default='')
    publicationName = models.CharField(max_length=200, default='')
    issn = models.CharField(max_length=20, default='')
    source_id = models.CharField(max_length=20, default='')
    eIssn = models.CharField(max_length=20, default='')
    aggregationType = models.CharField(max_length=20, default='')
    volume = models.CharField(max_length=4, default='')
    issueIdentifier = models.CharField(max_length=4, default='')
    article_number = models.CharField(max_length=4, default='')
    pageRange = models.CharField(max_length=20, default='')
    description = models.TextField(max_length=5000, default='')
    authkeywords = models.CharField(max_length=1000, default='')
    citedby_count = models.CharField(max_length=5, default='')
    openaccess = models.CharField(max_length=5, default='')
    freetoread = models.CharField(max_length=20, default='')
    freetoreadLabel = models.CharField(max_length=20, default='')
    fund_acr = models.CharField(max_length=50, default='')
    fund_no = models.CharField(max_length=50, default='')
    fund_sponsor = models.CharField(max_length=200, default='')
    last_updated = models.DateField()

    class Meta:
        db_table = 'test_db'
