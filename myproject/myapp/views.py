# -*- coding: utf-8 -*-
import scipy
from django.http import HttpResponse
from django.shortcuts import render
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views.decorators.csrf import csrf_exempt

import song_class
from myproject.myapp.models import Document
from myproject.myapp.forms import DocumentForm
import textwrap
@csrf_exempt
def list(request):
    # Handle file upload
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            newdoc = Document(docfile=request.FILES['docfile'])
            newdoc.save()

            song = song_class.genre_data(newdoc.docfile.name,newdoc.docfile.file)
            genre = song.get_genre()
            # Redirect to the document list after POST
            #return HttpResponseRedirect(reverse('list'))
            name = str(newdoc.docfile.name)
            newdoc.docfile.delete()
            response_text = textwrap.dedent('''\
                        <html>
                        <head>
                            <title>Greetings to the world</title>
                        </head>
                        <body>
                            <h1>Greetings to the world</h1>
                            <p>Hello, world!</p>
                            <p>'''+str(genre)+"/"+name+''''</p>
                        </body>
                        </html>
                    ''')

            return HttpResponse(response_text.encode('utf-8'), content_type="text/plain")
    else:
        form = DocumentForm()  # A empty, unbound form

    # Load documents for the list page
    documents = Document.objects.all()

    # Render list page with the documents and the form
    return render(
        request,
        'list.html',
        {'documents': documents, 'form': form}
    )#django.middleware.csrf.get_token(request)
