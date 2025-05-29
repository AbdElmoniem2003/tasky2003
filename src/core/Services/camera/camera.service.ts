import { Injectable } from "@angular/core";
import { ActionSheetController, ActionSheetOptions, AlertController } from "@ionic/angular";

import { Photo, CameraResultType, CameraSource, ImageOptions, Camera } from "@capacitor/camera"
import { readAndCompressImage, Config } from "browser-image-resizer"
import { TaskRes } from "src/core/types/task-res";
import { DeleteFileOptions, Directory, Filesystem, GetUriOptions, MkdirOptions, ReaddirOptions, ReadFileOptions, RenameOptions, WriteFileOptions } from "@capacitor/filesystem";
import { EndPointsEnum } from "src/core/enums/end_points";
import { NewTask } from "src/core/types/task";

const CAMERA = 'CAMERA'
const PHOTOS = "PHOTOS"
const RESET = "RESET"

@Injectable({ providedIn: "root" })

export class CameraService {


  constructor(
    private actionCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) { }


  chooseImageSource(img: string) {
    return new Promise<string>(async (resolve, reject) => {

      const opts: ActionSheetOptions = {
        mode: 'ios',
        header: 'Choose the miage Source',
        buttons: [{
          text: 'camera',
          handler: () => resolve(CAMERA)
        },
        {
          text: 'Gallery',
          handler: () => resolve(PHOTOS)
        }, {
          text: 'Cancel', role: "cancel",
        }]
      }

      img ? opts.buttons.push({
        text: 'Reset',
        handler: () => {
          resolve(RESET)
        }
      }) : null

      const action = await this.actionCtrl.create(opts)

      await action.present()
    })
  }


  getImage(img: string): Promise<Photo | null> {
    return new Promise(async (resolve, reject) => {
      const opts: ImageOptions = {
        resultType: CameraResultType.Uri,
        quality: 75,
        saveToGallery: true,
      }

      const source = await this.chooseImageSource(img)

      if (source == CAMERA) {
        opts.source = CameraSource.Camera;
        resolve(await Camera.getPhoto(opts))
      } else if (source == PHOTOS) {
        opts.source = CameraSource.Photos;
        resolve(await Camera.getPhoto(opts))
      }
      else if (source == RESET) {
        resolve(null)
      }
    })
  }

  async getImageBlob(img: Photo) {
    const response = await fetch(img.webPath);
    const blob = await response.blob()
    return blob
  }


  readImageBase64(blob: Blob): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      if (!blob) return;
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        resolve(reader.result)
      }
    })
  }


  resizeImage(imgBlob: Blob) {
    const configs: Config = {
      quality: 0.6,
      maxWidth: 500,
      maxHeight: 700,
    }

    return new Promise<Blob>(async (resolve, reject) => {
      const resizedBlob = await readAndCompressImage(imgBlob as File, configs);
      console.log(resizedBlob.size)
      resolve(resizedBlob)
    })
  }

  saveImage(task: TaskRes | NewTask) {
    const opts: WriteFileOptions = {
      directory: Directory.Cache,
      path: `${EndPointsEnum.STORED_IMAGES}/${task.title}_${task.desc}.png`,
      data: task.image
    }
    return Filesystem.writeFile(opts)
  }

  readImage(task: TaskRes | NewTask) {
    const opts: ReadFileOptions = {
      directory: Directory.Cache,
      path: `${EndPointsEnum.STORED_IMAGES}/${task.title}_${task.desc}.png`,
    }
    return new Promise<string>(async (resolve, reject) => {
      let data = (await Filesystem.readFile(opts)).data as string;
      data = "data:image/jpeg;base64," + data
      resolve(data)
    })
  }

  renameImage(oldTask: TaskRes | NewTask, newTask: NewTask) {
    const opts: RenameOptions = {
      directory: Directory.Cache,
      from: `${EndPointsEnum.STORED_IMAGES}/${oldTask.title}_${oldTask.desc}.png`,
      to: `${EndPointsEnum.STORED_IMAGES}/${newTask.title}_${newTask.desc}.png`,
    }
    return Filesystem.rename(opts)
  }

  async deleteImage(task: TaskRes) {
    const opts: DeleteFileOptions = {
      directory: Directory.Cache,
      path: `${EndPointsEnum.STORED_IMAGES}/${task.title}_${task.desc}.png`,
    }
    const readed = await this.readImage(task)
    if (readed) return Filesystem.deleteFile(opts)
  }

  getImageUri(task: TaskRes) {
    const opts: GetUriOptions = {
      directory: Directory.Cache,
      path: `${EndPointsEnum.STORED_IMAGES}/${task.title}_${task.desc}.png`,
    }
    return Filesystem.getUri(opts)
  }

  async makeImagesDir() {
    const opts: ReaddirOptions | MkdirOptions = {
      directory: Directory.Cache,
      path: `${EndPointsEnum.STORED_IMAGES}`
    }
    const readed = await Filesystem.readdir(opts)
    if (!readed) Filesystem.mkdir(opts);
  }

}
