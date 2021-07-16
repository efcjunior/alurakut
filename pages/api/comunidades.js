import {SiteClient} from 'datocms-client';

export default async function comunidades(request, response) {
    if(request.method === 'POST'){
        const TOKEN = 'e727e829d0601444ce4dc0d7bbac8e';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: '967966',
            ...request.body
        });

        response.json({
            dados: "response",
            registroCriado: registroCriado
        });    
        return;    
    }
    response.status(400).json({
        message: 'Invalid Request Method'
    });
}