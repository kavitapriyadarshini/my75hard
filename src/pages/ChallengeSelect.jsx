import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CHALLENGE_75_HARD, CHALLENGE_75_SOFT } from '../lib/challenge'
import './challenge-select.css'

export default function ChallengeSelect() {
  const navigate = useNavigate()

  const pick = async (type) => {
    const safe = type === CHALLENGE_75_SOFT ? CHALLENGE_75_SOFT : CHALLENGE_75_HARD
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user?.id) {
      const { data: prof } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()
      if (prof?.user_id) {
        await supabase.from('user_profiles').update({ challenge_type: safe }).eq('user_id', user.id)
      }
    }
    navigate('/onboarding', { replace: true, state: { challengeType: safe } })
  }

  return (
    <div className="challenge-select-page">
      <header className="challenge-select-header">
        <p className="challenge-select-brand">75 Hard Suite</p>
        <h1 className="challenge-select-title">Choose your challenge</h1>
        <p className="challenge-select-sub">
          Pick what fits today. You can switch later from Profile (it resets your day count).
        </p>
      </header>

      <div className="challenge-select-cards">
        <div className="challenge-card challenge-card--hard">
          <h2 className="challenge-card-title challenge-card-title--hard">75 HARD</h2>
          <p className="challenge-card-sub">The original mental toughness challenge.</p>
          <ul className="challenge-card-ul">
            <li>2 workouts / day — one outdoors</li>
            <li>3.7L water</li>
            <li>Strict clean diet</li>
            <li>10 pages reading</li>
            <li>Daily progress photo</li>
            <li>Restart on any miss</li>
          </ul>
          <span className="challenge-badge challenge-badge--adv">ADVANCED</span>
          <button
            type="button"
            className="challenge-card-select challenge-card-select--hard"
            onClick={() => void pick(CHALLENGE_75_HARD)}
          >
            Select 75 HARD
          </button>
        </div>

        <div className="challenge-card challenge-card--soft">
          <h2 className="challenge-card-title challenge-card-title--soft">75 SOFT</h2>
          <p className="challenge-card-sub">Build the foundation. Prove it to yourself.</p>
          <ul className="challenge-card-ul">
            <li>1 workout / day (any) · 1 rest day/week</li>
            <li>3L water</li>
            <li>Eat well (1 social drink/week ok)</li>
            <li>10 pages reading</li>
            <li>Progress photos are optional</li>
            <li>No restart on miss</li>
          </ul>
          <span className="challenge-badge challenge-badge--begin">BEGINNER FRIENDLY</span>
          <button
            type="button"
            className="challenge-card-select challenge-card-select--soft"
            onClick={() => void pick(CHALLENGE_75_SOFT)}
          >
            Select 75 SOFT
          </button>
        </div>
      </div>
    </div>
  )
}
