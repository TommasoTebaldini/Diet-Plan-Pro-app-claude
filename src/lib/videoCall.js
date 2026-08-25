// Videoconsulto dietista↔paziente via Jitsi Meet (meet.jit.si, servizio pubblico
// gratuito, nessuna chiave/account richiesti). Nessun signaling server-side, e il
// tier gratuito non offre token JWT per-sessione — quindi "autenticazione" alla
// stanza resta comunque solo "conoscere il nome", non crittografia end-to-end.
// Il nome stanza è però generato casualmente a ogni chiamata (non più derivato
// deterministicamente da patient_id/dietitian_id) e condiviso SOLO tramite il
// messaggio di chat già protetto da RLS: prima, chiunque conoscesse la coppia di
// UUID (potenzialmente ottenibile per altre vie, non solo leggendo la chat)
// poteva ricostruire il nome stanza da solo, e la stanza restava valida per
// sempre. Ora va letto per forza dal messaggio di chat, ed è diverso ad ogni
// chiamata.
export function callRoomName() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
  return `nutriplan-call-${hex}`
}

export function jitsiUrl(roomName, displayName) {
  const hash = [
    'config.prejoinPageEnabled=false',
    'config.disableDeepLinking=true',
    `userInfo.displayName=%22${encodeURIComponent(displayName || '')}%22`,
  ].join('&')
  return `https://meet.jit.si/${encodeURIComponent(roomName)}#${hash}`
}
