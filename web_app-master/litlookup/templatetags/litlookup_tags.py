from django import template

register = template.Library()

@register.simple_tag
def url_replace(request, field, value):

    dict_ = request.GET.copy()

    dict_[field] = value

    return dict_.urlencode()
@register.simple_tag
def parse_delimited(delimited_str, delimiter, replacement):
    if delimited_str:
        return delimited_str.replace(delimiter, replacement)
    else:
        return ''