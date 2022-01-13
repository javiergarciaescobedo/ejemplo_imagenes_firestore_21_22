import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

import { FirestoreService } from '../firestore.service';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {ionic 

  imageURL: String;

  constructor(private firestoreService: FirestoreService, 
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker) {}

  async uploadImagePicker(){
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
        }
        else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1,  // Permitir sólo 1 imagen
            outputType: 1           // 1 = Base64
          }).then(
            (results) => {  // En la variable results se tienen las imágenes seleccionadas
              // Carpeta del Storage donde se almacenará la imagen
              let nombreCarpeta = "imagenes";
              // Recorrer todas las imágenes que haya seleccionado el usuario
              //  aunque realmente sólo será 1 como se ha indicado en las opciones
              for (var i = 0; i < results.length; i++) {       
                // Mostrar el mensaje de espera
                loading.present();
                // Asignar el nombre de la imagen en función de la hora actual para
                //  evitar duplicidades de nombres         
                let nombreImagen = `${new Date().getTime()}`;
                // Llamar al método que sube la imagen al Storage
                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])
                  .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                      .then(downloadURL => {
                        // En la variable downloadURL se tiene la dirección de descarga de la imagen
                        console.log("downloadURL:" + downloadURL);
                        this.imageURL = downloadURL;
                        // Mostrar el mensaje de finalización de la subida
                        toast.present();
                        // Ocultar mensaje de espera
                        loading.dismiss();
                      })
                  })
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  } 

  private borrarImagen() {
    this.deleteFile(this.imageURL);
    this.imageURL = null;
  }

  async deleteFile(fileURL) {
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000
    });
    this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
  }

}
