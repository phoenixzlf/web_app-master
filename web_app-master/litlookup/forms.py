from django import forms

class articleFilterForm(forms.Form):
    def __init__(self, subtype_choices, *args, **kwargs):
        super(articleFilterForm, self).__init__(*args, **kwargs)
        self.fields['kw_search'] = forms.CharField(max_length=100, required=False, label='Search')
        self.fields['kw_search'].widget.attrs['class'] = 'form-control my-2'
        self.fields['kw_search'].widget.attrs['placeholder'] = 'Enter Keyphrase'
        self.fields['subtype'] = forms.ChoiceField(choices=subtype_choices, label='Document Type', required=False)
        self.fields['subtype'].widget.attrs['class'] = 'form-control my-2'
        self.fields['subtype'].initial = ''
