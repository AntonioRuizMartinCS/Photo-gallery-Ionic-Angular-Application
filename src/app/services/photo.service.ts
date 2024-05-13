import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';



@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  public filteredPhotos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';

  constructor() {}

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value!) || [];

  }

  public async filterPhotos(rating:number){

    for (let i = 0; i< this.photos.length; i++){

      if (this.photos[i].rating >= rating){

        this.filteredPhotos.push(this.photos[i])
      }
    }

    return this.filteredPhotos

  }

  public async addNewToGallery() {


    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100, // highest quality (0 to 100)
    });
    
     const savedImageFile = {
      fileUri: capturedPhoto.dataUrl??'',
      title: '' ,
      description: '',
      rating: 0

     }
    // Add new photo to Photos array
    this.photos.unshift(savedImageFile);

    // Cache all photo data for future retrieval
    this.setPreferences
  }

  public setPreferences(){

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

  }



  // Delete picture by removing it from reference data and the filesystem
  public async deletePicture(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    this.setPreferences

 }
}

export interface UserPhoto {

  fileUri: string;
  title: string;
  description: string;
  rating: number;
}