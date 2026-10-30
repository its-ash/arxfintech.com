<script setup lang="ts">
import { PhCheckCircle, PhCircleNotch, PhPaperPlaneTilt, PhWarningCircle } from '@phosphor-icons/vue'
import { bySlug, services } from '~/data/site'

const ENDPOINT = 'https://api.web3forms.com/submit'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Field = 'name' | 'email' | 'company' | 'phone' | 'topic' | 'message'

const route = useRoute()
const { web3formsKey } = useRuntimeConfig().public
const pick = () => {
  const t = String(route.query.topic ?? '')
  return bySlug[t] ? t : 'full-package'
}

const form = reactive<Record<Field, string>>({
  name: '',
  email: '',
  company: '',
  phone: '',
  topic: pick(),
  message: '',
})
const bot = ref(false)
const errors = reactive<Partial<Record<Field, string>>>({})
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const note = ref('')

onMounted(() => (form.topic = pick()))
watch(() => route.query.topic, () => (form.topic = pick()))

const validate = () => {
  const name = form.name.trim()
  const msg = form.message.trim()
  errors.name = name.length < 2 ? 'Enter your full name.' : name.length > 100 ? 'Use 100 characters or fewer.' : undefined
  errors.email = EMAIL_RE.test(form.email.trim()) ? undefined : 'Enter a valid email address.'
  errors.company = form.company.trim().length > 120 ? 'Use 120 characters or fewer.' : undefined
  errors.phone = form.phone && !/^\+?[\d\s()-]{6,20}$/.test(form.phone.trim()) ? 'Enter a valid phone number.' : undefined
  errors.message = msg.length < 10 ? 'Tell us a little more (10 characters minimum).' : msg.length > 2000 ? 'Use 2000 characters or fewer.' : undefined
  return !Object.values(errors).some(Boolean)
}

const submit = async () => {
  if (status.value === 'sending') return
  if (!validate()) {
    const first = (['name', 'email', 'company', 'phone', 'message'] as Field[]).find((k) => errors[k])
    if (first) document.getElementById(`f-${first}`)?.focus()
    return
  }
  if (!web3formsKey) {
    status.value = 'error'
    note.value = 'The form is not available right now. Please try again later.'
    return
  }
  status.value = 'sending'
  try {
    const topic = form.topic === 'full-package' ? 'Full package' : bySlug[form.topic]?.label ?? 'General'
    const res = await $fetch<{ success: boolean; message?: string }>(ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: {
        access_key: web3formsKey,
        subject: `Demo request: ${topic}`,
        from_name: 'ARX Fintech website',
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        topic,
        message: form.message.trim(),
        botcheck: bot.value,
      },
      timeout: 15000,
    })
    if (!res.success) throw new Error(res.message)
    status.value = 'sent'
  } catch {
    status.value = 'error'
    note.value = 'We could not send your request. Check your connection and try again.'
  }
}

const field = 'h-12 w-full rounded-xl border border-white/12 bg-ink-950/70 px-4 text-ink-50 placeholder:text-ink-500 transition-colors focus:border-accent focus:outline-none aria-[invalid=true]:border-[oklch(0.7_0.17_20)]'
</script>

<template>
  <div class="panel p-6 md:p-9">
    <div v-if="status === 'sent'" class="flex min-h-96 flex-col items-start justify-center" role="status">
      <PhCheckCircle :size="40" class="text-accent" />
      <h2 class="mt-5 text-2xl font-medium text-ink-50">Thank you, we have your request</h2>
      <p class="mt-3 max-w-[44ch] leading-relaxed text-ink-300">Our team will reply within one business day to book your call.</p>
    </div>

    <form v-else novalidate class="grid gap-5 sm:grid-cols-2" @submit.prevent="submit">
      <div class="flex flex-col gap-2">
        <label for="f-name" class="text-sm font-medium text-ink-100">Full name</label>
        <input id="f-name" v-model="form.name" :class="field" autocomplete="name" maxlength="100" required :aria-invalid="!!errors.name" :aria-describedby="errors.name ? 'e-name' : undefined" />
        <p v-if="errors.name" id="e-name" class="text-sm text-[oklch(0.78_0.14_20)]">{{ errors.name }}</p>
      </div>

      <div class="flex flex-col gap-2">
        <label for="f-email" class="text-sm font-medium text-ink-100">Work email</label>
        <input id="f-email" v-model="form.email" type="email" :class="field" autocomplete="email" maxlength="160" required :aria-invalid="!!errors.email" :aria-describedby="errors.email ? 'e-email' : undefined" />
        <p v-if="errors.email" id="e-email" class="text-sm text-[oklch(0.78_0.14_20)]">{{ errors.email }}</p>
      </div>

      <div class="flex flex-col gap-2">
        <label for="f-company" class="text-sm font-medium text-ink-100">Company <span class="font-normal text-ink-500">(optional)</span></label>
        <input id="f-company" v-model="form.company" :class="field" autocomplete="organization" maxlength="120" :aria-invalid="!!errors.company" :aria-describedby="errors.company ? 'e-company' : undefined" />
        <p v-if="errors.company" id="e-company" class="text-sm text-[oklch(0.78_0.14_20)]">{{ errors.company }}</p>
      </div>

      <div class="flex flex-col gap-2">
        <label for="f-phone" class="text-sm font-medium text-ink-100">Phone <span class="font-normal text-ink-500">(optional)</span></label>
        <input id="f-phone" v-model="form.phone" type="tel" :class="field" autocomplete="tel" maxlength="20" :aria-invalid="!!errors.phone" :aria-describedby="errors.phone ? 'e-phone' : undefined" />
        <p v-if="errors.phone" id="e-phone" class="text-sm text-[oklch(0.78_0.14_20)]">{{ errors.phone }}</p>
      </div>

      <div class="flex flex-col gap-2 sm:col-span-2">
        <label for="f-topic" class="text-sm font-medium text-ink-100">I am interested in</label>
        <select id="f-topic" v-model="form.topic" :class="field" class="appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 256 256%22><path fill=%22%23a7b6cb%22 d=%22M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat pr-10">
          <option value="full-package">Full package</option>
          <option v-for="s in services" :key="s.slug" :value="s.slug">{{ s.label }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-2 sm:col-span-2">
        <label for="f-message" class="text-sm font-medium text-ink-100">Your project</label>
        <textarea id="f-message" v-model="form.message" rows="5" :class="field" class="h-auto resize-y py-3 [field-sizing:content] min-h-32" maxlength="2000" required :aria-invalid="!!errors.message" aria-describedby="h-message" />
        <p id="h-message" class="text-sm text-ink-500" :class="errors.message && '!text-[oklch(0.78_0.14_20)]'">
          {{ errors.message ?? 'Target markets, timeline and the services you need.' }}
        </p>
      </div>

      <input v-model="bot" type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />

      <div class="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p v-if="status === 'error'" role="alert" class="flex items-center gap-2 text-sm text-[oklch(0.78_0.14_20)]">
          <PhWarningCircle :size="18" class="shrink-0" />
          {{ note }}
        </p>
        <p v-else class="text-sm text-ink-500">We reply within one business day.</p>
        <button type="submit" class="btn btn-primary disabled:opacity-70" :disabled="status === 'sending'">
          <PhCircleNotch v-if="status === 'sending'" :size="16" class="animate-spin" />
          <PhPaperPlaneTilt v-else :size="16" />
          {{ status === 'sending' ? 'Sending' : 'Send request' }}
        </button>
      </div>
    </form>
  </div>
</template>
