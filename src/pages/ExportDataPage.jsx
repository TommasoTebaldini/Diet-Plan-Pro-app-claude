import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Download, FileText, Activity, Droplets, Scale, Database, CheckCircle, Loader } from 'lucide-react'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

// ── helpers ───────────────────────────────────────────────────────────────────

function toCSV(rows, columns) {
  const header = columns.map(c => c.label).join(',')
  const lines = rows.map(r => columns.map(c => {
    const v = r[c.key] ?? ''
    const s = String(v).replace(/"/g, '""')
    return s.includes(',') || s.includes('\n') || s.includes('"') ? `"${s}"` : s
  }).join(','))
  return '﻿' + [header, ...lines].join('\n') // BOM for Excel UTF-8
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function today() {
  return format(new Date(), 'yyyy-MM-dd')
}

// ── ExportCard ────────────────────────────────────────────────────────────────

function ExportCard({ icon: Icon, title, description, color, onExport }) {
  const [status, setStatus] = useState('idle') // idle | loading | done

  async function handle() {
    setStatus('loading')
    try {
      await onExport()
      setStatus('done')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (e) {
      console.error('Export error:', e)
      setStatus('idle')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 14,
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: color + '22', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={22} color={color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{title}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{description}</p>
      </div>

      <button
        onClick={handle}
        disabled={status === 'loading'}
        style={{
          background: status === 'done' ? '#22c55e' : color,
          color: 'white',
          border: 'none',
          borderRadius: 10,
          padding: '9px 16px',
          fontSize: 13,
          fontWeight: 600,
          cursor: status === 'loading' ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        {status === 'loading' && <Loader size={14} style={{ animation: 'spin 0.7s linear infinite' }} />}
        {status === 'done' && <CheckCircle size={14} />}
        {status === 'idle' && <Download size={14} />}
        {status === 'loading' ? 'Esportando…' : status === 'done' ? 'Scaricato!' : 'Esporta'}
      </button>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ExportDataPage() {
  const { user } = useAuth()

  // ── Diario alimentare CSV ─────────────────────────────────────────────────
  async function exportFoodLogs() {
    const { data, error } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('logged_at')
    if (error) throw error

    const MEAL_LABELS = {
      colazione: 'Colazione', spuntino_mattina: 'Spuntino mat.',
      pranzo: 'Pranzo', spuntino_pomeriggio: 'Merenda', cena: 'Cena',
    }

    const rows = (data || []).map(r => ({
      data: r.logged_at ? format(new Date(r.logged_at), 'dd/MM/yyyy', { locale: it }) : '',
      ora: r.logged_at ? format(new Date(r.logged_at), 'HH:mm') : '',
      pasto: MEAL_LABELS[r.meal_type] || r.meal_type || '',
      alimento: r.food_name || '',
      grammi: r.grams ?? '',
      kcal: r.kcal ?? '',
      proteine: r.proteins ?? '',
      carboidrati: r.carbs ?? '',
      grassi: r.fats ?? '',
    }))

    const csv = toCSV(rows, [
      { key: 'data', label: 'Data' },
      { key: 'ora', label: 'Ora' },
      { key: 'pasto', label: 'Pasto' },
      { key: 'alimento', label: 'Alimento' },
      { key: 'grammi', label: 'Grammi' },
      { key: 'kcal', label: 'Kcal' },
      { key: 'proteine', label: 'Proteine (g)' },
      { key: 'carboidrati', label: 'Carboidrati (g)' },
      { key: 'grassi', label: 'Grassi (g)' },
    ])
    downloadFile(csv, `nutriplan_diario_${today()}.csv`, 'text/csv;charset=utf-8')
  }

  // ── Peso CSV ──────────────────────────────────────────────────────────────
  async function exportWeightLogs() {
    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date')
    if (error) throw error

    const rows = (data || []).map(r => ({
      data: r.date || '',
      peso_kg: r.weight_kg ?? '',
      note: r.note || '',
    }))

    const csv = toCSV(rows, [
      { key: 'data', label: 'Data' },
      { key: 'peso_kg', label: 'Peso (kg)' },
      { key: 'note', label: 'Note' },
    ])
    downloadFile(csv, `nutriplan_peso_${today()}.csv`, 'text/csv;charset=utf-8')
  }

  // ── Benessere CSV ─────────────────────────────────────────────────────────
  async function exportWellness() {
    const { data, error } = await supabase
      .from('daily_wellness')
      .select('*')
      .eq('user_id', user.id)
      .order('date')
    if (error) throw error

    const rows = (data || []).map(r => ({
      data: r.date || '',
      umore: r.mood ?? '',
      energia: r.energy ?? '',
      sonno: r.sleep_quality ?? '',
      stress: r.stress_level ?? '',
      idratazione: r.hydration_level ?? '',
      sintomi: Array.isArray(r.symptoms) ? r.symptoms.join('; ') : (r.symptoms || ''),
      note: r.notes || '',
    }))

    const csv = toCSV(rows, [
      { key: 'data', label: 'Data' },
      { key: 'umore', label: 'Umore (1-5)' },
      { key: 'energia', label: 'Energia (1-5)' },
      { key: 'sonno', label: 'Qualità sonno (1-5)' },
      { key: 'stress', label: 'Stress (1-5)' },
      { key: 'idratazione', label: 'Idratazione (1-5)' },
      { key: 'sintomi', label: 'Sintomi' },
      { key: 'note', label: 'Note' },
    ])
    downloadFile(csv, `nutriplan_benessere_${today()}.csv`, 'text/csv;charset=utf-8')
  }

  // ── Export completo JSON ──────────────────────────────────────────────────
  async function exportAllJSON() {
    const [foodLogs, waterLogs, weightLogs, wellness, activityLogs] = await Promise.all([
      supabase.from('food_logs').select('*').eq('user_id', user.id).order('logged_at'),
      supabase.from('water_logs').select('*').eq('user_id', user.id).order('logged_at'),
      supabase.from('weight_logs').select('*').eq('user_id', user.id).order('date'),
      supabase.from('daily_wellness').select('*').eq('user_id', user.id).order('date'),
      supabase.from('activity_logs').select('*').eq('user_id', user.id).order('date'),
    ])

    const exportPayload = {
      export_date: new Date().toISOString(),
      user_id: user.id,
      note: 'Esportazione dati personali ai sensi del GDPR Art. 20 – Portabilità dei dati',
      data: {
        diario_alimentare: foodLogs.data || [],
        acqua: waterLogs.data || [],
        peso: weightLogs.data || [],
        benessere: wellness.data || [],
        attivita: activityLogs.data || [],
      },
    }

    const json = JSON.stringify(exportPayload, null, 2)
    downloadFile(json, `nutriplan_export_${today()}.json`, 'application/json')
  }

  return (
    <div className="page" style={{ padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a7f5a, #0d5c41)',
        padding: '24px 20px 28px',
        color: 'white',
      }}>
        <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
          GDPR Art. 20
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>📤 Esporta i tuoi dati</h1>
        <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>
          Hai il diritto di ricevere i tuoi dati personali in un formato strutturato e leggibile.
        </p>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Info banner */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 12,
          padding: '12px 14px',
          fontSize: 12,
          color: '#1e40af',
          lineHeight: 1.6,
        }}>
          <strong>💡 Come funziona:</strong> ogni export scarica un file direttamente sul tuo dispositivo.
          I file CSV si aprono con Excel o Numbers. Il JSON è per sviluppatori o backup completo.
        </div>

        {/* Export cards */}
        <ExportCard
          icon={FileText}
          title="Diario alimentare"
          description="Tutti i pasti registrati con macro (kcal, proteine, carboidrati, grassi) e orari."
          color="#1a7f5a"
          onExport={exportFoodLogs}
        />

        <ExportCard
          icon={Scale}
          title="Storico peso"
          description="Tutte le misurazioni del peso nel tempo."
          color="#7c3aed"
          onExport={exportWeightLogs}
        />

        <ExportCard
          icon={Activity}
          title="Benessere & umore"
          description="Dati giornalieri di umore, energia, qualità del sonno, stress e sintomi."
          color="#ec4899"
          onExport={exportWellness}
        />

        <ExportCard
          icon={Database}
          title="Export completo (JSON)"
          description="Tutti i tuoi dati in un unico file JSON: diario, acqua, peso, benessere e attività."
          color="#f59e0b"
          onExport={exportAllJSON}
        />

        {/* Legal note */}
        <div style={{
          marginTop: 8,
          padding: '12px 14px',
          background: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 12,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.7,
        }}>
          <strong>Informativa:</strong> I dati esportati sono di tua proprietà esclusiva (GDPR Reg. UE 2016/679,
          Art. 20). NutriPlan non condivide questi dati con terze parti senza il tuo esplicito consenso.
          Per richiedere la cancellazione dei tuoi dati, contatta il supporto o usa la sezione Profilo.
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
