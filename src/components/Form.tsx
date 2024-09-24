import { useState, useCallback, useEffect } from "react";
import { CloudinaryService } from "../services/upload-file";

const Form = () => {
  const [formState, setFormState] = useState({
    selectedFile  : null as File | null,
    loading       : false,
    error         : null as string | null,
    successMessage: null as string | null,
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setFormState(prev => ({ ...prev, selectedFile: file, error: null }));
    } else {
      setFormState(prev => ({ ...prev, selectedFile: null, error: "Por favor, selecciona una imagen o un archivo PDF." }));
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.selectedFile) {
      setFormState(prev => ({ ...prev, error: "Por favor selecciona una imagen o un PDF antes de enviar." }));
      return;
    }

    setFormState(prev => ({ ...prev, loading: true, error: null, successMessage: null }));

    try {
      await CloudinaryService.createItem(formState.selectedFile);
      setFormState(() => ({ 
        selectedFile  : null,
        loading       : false,
        error         : null,
        successMessage: "El archivo se ha subido correctamente."
      }));
    } catch (err) {
      console.error(err);
      setFormState(prev => ({ ...prev, loading: false, error: "Hubo un error al subir el archivo." }));
    }
  }, [formState.selectedFile]);

  useEffect(() => {
    if (formState.successMessage) {
      const timer = setTimeout(() => {
        setFormState(prev => ({ ...prev, successMessage: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formState.successMessage]);

  return (
    <div className="form">
      <form className="form__container" onSubmit={handleSubmit}>
        <div className="form__input-group">
          <label className="form__label" htmlFor="file">Selecciona una imagen o PDF:</label>
          <input 
            className="form__input form__input--file" 
            type="file" 
            id="file" 
            onChange={handleFileChange} 
            accept="image/*,.pdf"
            value=""
          />
        </div>

        <button 
          className="form__button form__button--submit" 
          type="submit" 
          disabled={formState.loading || !formState.selectedFile}
        >
          {formState.loading ? "Subiendo..." : "Subir Archivo"}
        </button>
      </form>

      {formState.error && <p className="form__message form__message--error">{formState.error}</p>}
      {formState.successMessage && <p className="form__message form__message--success">{formState.successMessage}</p>}
    </div>
  );
};

export default Form;
