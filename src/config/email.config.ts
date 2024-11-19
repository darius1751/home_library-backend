import { config } from 'dotenv';
import { createTransport } from 'nodemailer';

config();

export const transport = createTransport(<any>{
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: process.env.OAUTH_ACCESS_TOKEN,
        // accessToken: 'ya29.a0AeDClZDj-hbQJPXVR6uVfWgvWCVLejNYZKVCyQxxFSuQUfJaqGAiv_aok7Pp2PF6rkaPdcM3z0wvPJNr1J8-s0QSOBgm7E2VhcxKkhAcDACiit_66JNJ-STHb3Yd4ap7J52L-nwSRBmGeBqY13QgnIKbnMH9IG1rmeYGOLGlaCgYKAeQSARASFQHGX2MipiIy5GrsGsOCciFLX0Fmkw0175'
    }
})

