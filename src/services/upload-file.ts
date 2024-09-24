import { AxiosError } from "axios";
import { api } from "../api/base";

export class CloudinaryService {
  static createItem = async (file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await api.post('/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError) throw new Error(error.response?.data);
      console.log(error);
      throw new Error('Error al subir la imágen');
    }
  };
}
