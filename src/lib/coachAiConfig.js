// Flag di attivazione lato UI del Coach AI. Il controllo che conta davvero è
// lato server (api/coach-ai.js, COACH_AI_ENABLED) — questo serve solo a non
// mostrare una chat che risponderebbe comunque con "disattivato". Va tenuto
// manualmente allineato al valore server-side: sono due repo/runtime
// separati, nessun modo di condividere una singola fonte di verità (stesso
// limite già noto per PAYMENTS_ACTIVE, vedi src/hooks/useSubscription.js).
export const COACH_AI_ENABLED = false
