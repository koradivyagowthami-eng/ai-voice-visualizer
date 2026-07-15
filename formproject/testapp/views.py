from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import StudentForm
from .models import Student


def student_view(request):
    if request.method == 'POST':
        form = StudentForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Student details saved successfully.')
            return redirect('success')
    else:
        form = StudentForm()

    return render(request, 'student_form.html', {'form': form})


def success_view(request):
    return render(request, 'success.html')


def student_list(request):
    students = Student.objects.all()
    return render(request, 'student_list.html', {'students': students})
