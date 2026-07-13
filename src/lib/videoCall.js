// Videoconsulto dietista↔paziente via Jitsi Meet (meet.jit.si, servizio pubblico
// gratuito, nessuna chiave/account richiesti). Nessun signaling server-side: il
// nome stanza è derivato deterministicamente dalla coppia patient_id/dietitian_id
// (entrambi UUID casuali di Supabase), quindi indovinabile solo da chi conosce già
// quella coppia — sufficiente per un MVP, non è crittografia end-to-end.

export function callRoomName(patientId, dietitianId) {
  const ids = [patientId, dietitianId].filter(Boolean).sort()
  return `nutriplan-call-${ids.join('-')}`.replace(/[^a-zA-Z0-9-]/g, '')
}

export function jitsiUrl(roomName, displayName) {
  const hash = [
    'config.prejoinPageEnabled=false',
    'config.disableDeepLinking=true',
    `userInfo.displayName=%22${encodeURIComponent(displayName || '')}%22`,
  ].join('&')
  return `https://meet.jit.si/${encodeURIComponent(roomName)}#${hash}`
}
