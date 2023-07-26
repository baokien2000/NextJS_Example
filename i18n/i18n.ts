import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import EN from "../asset/localization/language/EN.json";
import VN from "../asset/localization/language/VN.json";
i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: {translation: EN},
            vi: {translation: VN},
        },
        lng: "vi", 
        fallbackLng: "vi",
        interpolation: {
            escapeValue: false, 
        },
    });
export default i18n;