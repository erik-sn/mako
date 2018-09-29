import os
from django.conf import settings
from mako.celery import app
from shutil import rmtree
import traceback

from training.retrain import retrain_network


def clean_training_directory(training_run) -> None:
    rmtree(training_run.image_dir)
    root = os.path.join(settings.BASE_DIR, 'training', training_run.name)
    rmtree(os.path.join(root, 'bottleneck'))
    rmtree(os.path.join(root, 'retrain_logs'))
    for file in os.listdir(root):
        if not file == 'retrained_graph.pb':
            file_path = os.path.join(root, file)
            if os.path.isdir(file_path):
                rmtree(file_path)
            else:
                os.remove(file_path)


@app.task(bind=True, name="train_classifier")
def train_classifier(self, training_run_id):
    from api.models import TrainingRun
    training_run = TrainingRun.objects.get(id=training_run_id)
    try:
        training_run.set_status('in_progress')
        retrain_network(training_run)
    except SystemExit:
        training_run.set_output_graph_location()
        training_run.set_status('complete')
        clean_training_directory(training_run)
    except Exception as e:
        tb = traceback.format_exc()
        training_run.error_message = tb
        training_run.status = 'error'
        training_run.save()
        raise e


