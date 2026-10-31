import { getDb } from '../../../db/index';
import { messages } from '../../../db/schema';
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Origen no permitido.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Formato no admitido.'},{status:415});
 let raw:string;try{raw=await request.text();}catch{return Response.json({error:'Petición no válida.'},{status:400});}
 if(raw.length>12000)return Response.json({error:'Mensaje demasiado largo.'},{status:413});
 let body:Record<string,unknown>;try{body=JSON.parse(raw);if(!body||typeof body!=='object')throw new Error();}catch{return Response.json({error:'Petición no válida.'},{status:400});}
 const {name,email,message,consent,website}=body;
 if(website)return Response.json({error:'No se pudo validar el envío.'},{status:400});
 if(typeof name!=='string'||name.trim().length<2||name.length>80||typeof email!=='string'||email.length>160||!/^\S+@\S+\.\S+$/.test(email)||typeof message!=='string'||message.trim().length<10||message.length>2000||consent!=='on')return Response.json({error:'Revisa el nombre, el email, el mensaje (mínimo 10 caracteres) y el consentimiento.'},{status:400});
 try{const id=crypto.randomUUID();await getDb().insert(messages).values({id,name:name.trim(),email:email.trim().toLowerCase(),message:message.trim(),createdAt:new Date().toISOString()});return Response.json({reference:id.slice(0,8).toUpperCase()},{status:201,headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Ahora mismo no podemos guardar tu mensaje. Inténtalo más tarde.'},{status:503});}
}
