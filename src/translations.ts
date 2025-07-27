export interface Translation {
  guitar: string
  chromatic: string
  instrument: string
  mode: string
  gtr_string: string
  reference: string
  no_tone: string
  reference_a4: string
  tuning_440: string
  tuning_432: string
  tuning_444: string
  error_mic_access: string
  configure_permissions: string
}

export const en: Translation = {
  guitar: "Guitar",
  chromatic: "Chromatic",
  instrument: "Instrument",
  mode: "Mode",
  gtr_string: "STRING",
  reference: "REFERENCE",
  no_tone: "No tone",
  reference_a4: "Reference (A4)",
  tuning_440: "440Hz (standard)",
  tuning_432: "432Hz (Verdi)",
  tuning_444: "444Hz (high pitch)",
  error_mic_access: "Tuneo requires microphone permissions to hear your guitar.",
  configure_permissions: "Configure permissions",
}

export const es: Translation = {
  guitar: "Guitarra",
  chromatic: "Cromática",
  instrument: "Instrumento",
  mode: "Modo",
  gtr_string: "CUERDA",
  reference: "REFERENCIA",
  no_tone: "Sin tono",
  reference_a4: "Referencia (A4)",
  tuning_440: "440Hz (estándar)",
  tuning_432: "432Hz (Verdi)",
  tuning_444: "444Hz (tono alto)",
  error_mic_access: "Tuneo necesita permiso de micrófono para escuchar la guitarra.",
  configure_permissions: "Configurar permisos",
}
