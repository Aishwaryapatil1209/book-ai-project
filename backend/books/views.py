from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

@api_view(['GET'])
def get_books(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_book(request, id):
    book = Book.objects.get(id=id)
    serializer = BookSerializer(book)
    return Response(serializer.data)

import requests
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def ask_question(request):
    if request.method == "POST":
        data = json.loads(request.body)

        question = data.get("question")
        book_id = data.get("book_id")
        type = data.get("type") 

        book = Book.objects.get(id=book_id)

        if type == "summary":
            prompt = f"""
            Book Description: {book.description}

            Give a short summary of this book.
            """

        elif type == "genre":
            prompt = f"""
            Book Description: {book.description}

            What is the genre of this book?
            """

        else:
            prompt = f"""
            Book Description: {book.description}

            Answer this question: {question}
            """

        url = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post(url, headers=headers, json=payload)

        result = response.json()
        print(result)

        if "choices" in result:
            answer = result["choices"][0]["message"]["content"]
            return JsonResponse({"answer": answer})
        else:
            return JsonResponse({"error": result})

        return JsonResponse({"answer": answer})
    