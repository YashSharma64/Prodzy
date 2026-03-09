
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.evaluate import router as evaluate_router
from app.routes.generate import router as generate_router


def create_app() -> FastAPI:
  app = FastAPI(title='Prodzy API', version='0.1.0')

  app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
  )

  @app.get('/health')
  async def health():
    return {'status': 'ok'}

  app.include_router(generate_router)
  app.include_router(evaluate_router)

  return app


app = create_app()
