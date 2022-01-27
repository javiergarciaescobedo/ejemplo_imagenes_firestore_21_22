import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage) {     
  }

  // Métodos para gestión de colecciones en Firestore Database

  public insertar(coleccion, datos) {
    return this.angularFirestore.collection(coleccion).add(datos);
  }  

  public consultar(coleccion) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public borrar(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  public actualizar(coleccion, documentId, datos) {
    return this.angularFirestore.collection(coleccion).doc(documentId).set(datos);
  }

  public consultarPorId(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
  }

  // Métodos para almacenamiento de archivos en Storage

  public subirImagenBase64(nombreCarpeta, nombreArchivo, imagenBase64){
    let storageRef = this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString(imagenBase64, 'data_url');
  }

  public borrarArchivoPorURL(url) {
    return this.angularFireStorage.storage.refFromURL(url).delete();
  }
  
}
