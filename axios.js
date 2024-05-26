const axios = require('axios');

const apiKey = "AIzaSyCqRYINJR0ON1xtGrwYN5IrfcsrJHBQkwI";

async function traducirTexto(texto, idiomaDestino) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const data = {
        q: texto,
        target: idiomaDestino
    };

    try {
        const respuesta = await axios.post(url, data);
        return respuesta.data.data.translations[0].translatedText;
    } catch (error) {
        console.error("Error al traducir el texto:", error);
        return null;
    }
}

// Ejemplo de uso
const textoATraducir = "Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world, challenging their very existence – and our own.";
const idiomaDestino = "es"; // Por ejemplo, español

traducirTexto(textoATraducir, idiomaDestino)
    .then(traduccion => {
        console.log("Texto traducido:", traduccion);
    })
    .catch(error => {
        console.error("Error:", error);
    });
