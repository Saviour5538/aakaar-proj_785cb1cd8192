from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.config import get_db
from database.models import Match
from backend.services.auth import get_current_user
from datetime import datetime
from uuid import UUID

router = APIRouter(prefix="/stats")

class StatsResponse(BaseModel):
    total_matches: int
    wins: int
    losses: int
    draws: int
    last_match_date: datetime | None

@router.get("/", response_model=StatsResponse, operation_id="get_stats")
async def get_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.id

    # Query total matches
    total_matches = db.query(Match).filter(Match.user_id == user_id).count()

    # Query wins
    wins = db.query(Match).filter(Match.user_id == user_id, Match.result == "win").count()

    # Query losses
    losses = db.query(Match).filter(Match.user_id == user_id, Match.result == "loss").count()

    # Query draws
    draws = db.query(Match).filter(Match.user_id == user_id, Match.result == "draw").count()

    # Query last match date
    last_match = (
        db.query(Match)
        .filter(Match.user_id == user_id)
        .order_by(Match.created_at.desc())
        .first()
    )
    last_match_date = last_match.created_at if last_match else None

    return StatsResponse(
        total_matches=total_matches,
        wins=wins,
        losses=losses,
        draws=draws,
        last_match_date=last_match_date,
    )