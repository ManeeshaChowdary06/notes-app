from fastapi import APIRouter,Depends,HTTPException,UploadFile,File,Form
from sqlalchemy.orm import Session
import shutil
import os

from ..database import SessionLocal
from .. import models
from ..dependencies import get_current_user


router=APIRouter(
prefix="/notes",
tags=["Notes"]
)


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()



# CREATE NOTE
@router.post("/")
async def create_note(
title:str=Form(...),
content:str=Form(...),
image:UploadFile=File(None),
db:Session=Depends(get_db),
user_id:int=Depends(get_current_user)
):

    image_path=None

    if image:

        os.makedirs("uploads",exist_ok=True)

        file_location=f"uploads/{image.filename}"

        with open(file_location,"wb") as buffer:
            shutil.copyfileobj(image.file,buffer)

        image_path=f"/uploads/{image.filename}"

    new_note=models.Note(
    title=title,
    content=content,
    image_url=image_path,
    user_id=user_id
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note

@router.get("/search")  
def search_notes(query: str,
                 db: Session = Depends(get_db),
                 current_user = Depends(get_current_user)):

    return db.query(models.Note).filter(
        models.Note.user_id == current_user,
        models.Note.title.ilike(f"%{query}%")
    ).all()


# GET NOTES
@router.get("/")
def get_notes(
db:Session=Depends(get_db),
user_id:int=Depends(get_current_user)
):

    return db.query(models.Note).filter(
    models.Note.user_id==user_id
    ).all()



# UPDATE NOTE
@router.put("/{note_id}")
async def update_note(
note_id:int,
title:str=Form(...),
content:str=Form(...),
image:UploadFile=File(None),
db:Session=Depends(get_db),
user_id:int=Depends(get_current_user)
):

    db_note=db.query(models.Note).filter(
    models.Note.id==note_id,
    models.Note.user_id==user_id
    ).first()

    if not db_note:
        raise HTTPException(status_code=404,detail="Note not found")

    db_note.title=title
    db_note.content=content

    if image:

        os.makedirs("uploads",exist_ok=True)

        file_location=f"uploads/{image.filename}"

        with open(file_location,"wb") as buffer:
            shutil.copyfileobj(image.file,buffer)

        db_note.image_url=f"/uploads/{image.filename}"

    db.commit()
    db.refresh(db_note)

    return db_note



# DELETE NOTE
@router.delete("/{note_id}")
def delete_note(
note_id:int,
db:Session=Depends(get_db),
user_id:int=Depends(get_current_user)
):

    db_note=db.query(models.Note).filter(
    models.Note.id==note_id,
    models.Note.user_id==user_id
    ).first()

    if not db_note:
        raise HTTPException(status_code=404,detail="Note not found")

    db.delete(db_note)
    db.commit()

    return {"message":"Deleted"}