# La Pausa · Café de barrio

Landing de una página para una cafetería ficticia. Implementada con React 19, TypeScript, Vinext/Vite y CSS adaptable. El servidor es un Worker de Cloudflare y los mensajes se guardan en D1 (SQLite). No requiere Lovable.

## Previsualización

https://aaq28.github.io/la-pausa/

Versión estática publicada en GitHub Pages con `pnpm build:pages` (`vite.pages.config.ts`, carpeta `static/`) y desplegada automáticamente por `.github/workflows/pages.yml` en cada push a `main`. En esta versión no hay servidor: el formulario valida los campos y muestra una referencia, pero **es una simulación y no guarda nada**. La versión completa con Worker y D1 se ejecuta en local (ver abajo).

## Arranque local

Requisitos: Node.js >=22.13 y pnpm (versión fijada en `package.json`).

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_greedy_wallflower.sql
pnpm dev
```

Abre la URL que indique el servidor. El primer arranque requiere aplicar la migración. No la repitas sobre una base ya inicializada. `pnpm start` permite probar el resultado compilado. No es una web estática: GitHub Pages por sí solo no ejecutará el formulario.

## Qué incluye

- Presentación, esencia, carta por categorías, horarios y contacto.
- Menú móvil, etiquetas de formulario, navegación por teclado, enlace para saltar al contenido y respeto por movimiento reducido.
- `POST /api/contact`: valida datos y consentimiento en servidor, limita longitud, comprueba origen y campo trampa antispam. Inserción parametrizada mediante Drizzle.
- Confirmación con referencia solo después de persistir el mensaje; errores de red/servidor visibles y botón bloqueado durante el envío.
- Sin cookies propias de marketing ni analítica. Metadatos `noindex` para la demo.

## Qué está simulado

La marca, ubicación, horarios, carta y precios son ejemplos; no hay un negocio real ni reservas. El formulario **sí envía y persiste** los mensajes en D1, pero **no envía correos electrónicos**. La interfaz lo explica antes de enviar. Usa exclusivamente nombres, emails y mensajes ficticios. No se muestra una bandeja pública ni se exponen mensajes a visitantes.

No se incluyen datos de cliente ni el briefing privado en la web. El proyecto no debe publicarse como portfolio ni abrirse su repositorio sin autorización.

## Datos de ejemplo y reinicio

La carta se define en `app/page.tsx`; no necesita semillas ni base de datos. La base de mensajes empieza vacía.

Para borrar **todos los mensajes locales** de prueba:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --command 'DELETE FROM contact_messages;'
```

No hay un endpoint público de borrado. Para reiniciar la base alojada, el propietario debe ejecutar ese mismo SQL desde el panel de la base D1 correspondiente. Las bases local y alojada son independientes; el comando anterior no borra producción. No edites migraciones que ya se han aplicado.

## Verificación manual

1. Revisar a 390 px y en escritorio: sin desbordamiento, navegación operativa, textos legibles.
2. Alternar las tres categorías de la carta.
3. Enviar un mensaje ficticio de al menos 10 caracteres con consentimiento. Debe aparecer una referencia y vaciarse el formulario.
4. Probar email inválido y consentimiento sin marcar: el navegador bloquea el envío.
5. Desactivar la conexión y enviar: aparece un error, sin confirmación falsa.
6. Consultar la base D1 como propietario para comprobar la persistencia; el contenido no se publica.

Comprobación de tipos: `pnpm exec tsc --noEmit`. Compilación: `pnpm build`.

## Entrega en GitHub

Crear un repositorio **privado** y subir los archivos con su lockfile, migraciones y README. Excluir `node_modules`, `dist`, `.wrangler`, `.sites-runtime`, `.env*` y credenciales (ya cubiertos por `.gitignore`). Invitar al usuario `kodarvia` como colaborador y comprobar su acceso antes de enviar la entrega. Añadir en el portal el enlace al repositorio y la previsualización. El código de GitHub y la versión desplegada deben corresponder.

## Estructura

- `app/page.tsx`: landing y formulario React.
- `app/globals.css`: diseño y adaptación móvil.
- `app/api/contact/route.ts`: endpoint de contacto.
- `db/` y `drizzle/`: esquema y migraciones.
- `public/`: imagen y favicon locales.
- `.openai/hosting.json`: configuración del despliegue actual; no contiene secretos.
- `scripts/`, `worker/`, `vite.config.ts`: ejecución y despliegue.

## Recursos y límites

Fotografía: Unsplash, https://images.unsplash.com/photo-1442512595331-e89e73853f31 (archivo servido localmente). Tipografías DM Sans y Playfair Display: Google Fonts. Iconos: Lucide (ISC). Si las fuentes externas fallan, se utilizan fuentes del sistema.

Antes de usar con un negocio real: sustituir todos los datos, definir un receptor de email si se requiere, añadir protección antispam con límites por visitante, política de privacidad real y retención automática. Esta demo no incorpora esos servicios ni promete una reserva.
