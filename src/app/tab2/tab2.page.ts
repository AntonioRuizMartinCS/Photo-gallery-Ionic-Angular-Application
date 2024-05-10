import { Component} from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService: PhotoService,
              public actionSheetController: ActionSheetController,
              public alertController: AlertController,
            ) { }

  addPhotoToGallery() {
    
  this.photoService.addNewToGallery();
}

async ngOnInit() {
  await this.photoService.loadSaved();

}

handleChange(e: { detail: { value: number } }) {
  console.log('ionChange fired with value: ' + e.detail.value);
  this.photoService.filterPhotos(e.detail.value)
}

public async displayFilteredPhotos(){



}


public async showActionSheet(photo: UserPhoto, position: number) {
  const actionSheet = await this.actionSheetController.create({
    header: 'Photos',

    buttons: [{
      text: 'Delete',
      role: 'destructive',
      icon: 'trash',
      handler: () => {
        this.photoService.deletePicture(photo, position);
      }
    }, 

    {
      text: 'Edit',
      icon: 'create-outline',
      handler: () => {
        this.showInputAlert(photo, position);
      }
    },
    
    {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        // Nothing to do, action sheet is automatically closed
        }
    }]
  });

  console.log('this is a test');
  await actionSheet.present();
}


public async showInputAlert(photo: UserPhoto, position: number){


  const alert = await this.alertController.create({

    header: 'Enter details',
    inputs: [
      {
        name: 'imageName',
        value: photo.title,
        placeholder: 'Image tittle (max 20 characters)',
        attributes: {
        maxlength: 20,
        },
      },
      {
        name: 'imageDescription',
        value: photo.description,
        type: 'textarea',
        placeholder: 'image description',
      },

      {
        name: 'imageRating',
        type: 'number',
        value: photo.rating,
        placeholder: 'rating',
        min: 0,
        max: 5,
      }
    ],

    buttons: [{
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('cancel button pressed');
        }
    },
    {
      text: 'Save',
      
      handler: data => {
        this.photoService.photos[position].title = data.imageName;
        this.photoService.photos[position].description = data.imageDescription;
        this.photoService.photos[position].rating = data.imageRating;
        this.photoService.setPreferences();
        console.log(this.photoService.photos[position].title);
        console.log(this.photoService.photos[position].description);
      
      }
    }]
  });

  console.log('Alert input appearing');
  await alert.present();

}

}






