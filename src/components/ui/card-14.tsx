import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { SparklesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type PromoCard = {
  ctaLabel: string
  icon: LucideIcon
  message: string
  title: string
}

const promoCard: PromoCard = {
  ctaLabel: 'Give feedback',
  icon: SparklesIcon,
  message:
    'Tell us what you think about this app. Your ideas help us make it better.',
  title: 'How is this app working for you?'
}

type FeedbackFormState = {
  name: string
  email: string
  topic: string
  details: string
}

const initialForm: FeedbackFormState = {
  name: '',
  email: '',
  topic: '',
  details: ''
}

const Card14 = () => {
  const Icon = promoCard.icon
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [form, setForm] = useState<FeedbackFormState>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleChange = (field: keyof FeedbackFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const isValid =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.details.trim().length > 0

  const handleSubmit = async () => {
    if (!isValid) return
    setIsSubmitting(true)
    try {
      // TODO: replace with your actual feedback API endpoint / backend call
      // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(form) })
      await new Promise((resolve) => setTimeout(resolve, 600))
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setIsSubmitted(false)
    setForm(initialForm)
  }

  return (
    <>
     <Card className='relative mx-auto w-full max-w-lg border-border/70 shadow-sm'>
        <CardHeader className='flex flex-col items-center gap-2 pb-3 text-center'>
          <div className='flex size-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300'>
            <Icon className='size-5' />
          </div>
          <CardTitle className='text-center'>{promoCard.title}</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4 text-center'>
          <p className='max-w-sm text-sm leading-6 text-muted-foreground'>
            {promoCard.message}
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className='self-center bg-green-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.18),0_8px_18px_rgba(22,101,52,0.24)] hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-500'
          >
            {promoCard.ctaLabel}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
        <DialogContent className='sm:max-w-md'>
          {!isSubmitted ? (
            <>
              <DialogHeader className='text-left'>
                <DialogTitle>Give feedback</DialogTitle>
                <DialogDescription>
                  Tell us what you like or what we can make better.
                </DialogDescription>
              </DialogHeader>

              <div className='flex flex-col gap-4 py-2'>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='feedback-name'>Your name</Label>
                  <Input
                    id='feedback-name'
                    placeholder='Type your name'
                    value={form.name}
                    onChange={handleChange('name')}
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='feedback-email'>Phone number</Label>
                  <Input
                    id='feedback-email'
                    placeholder='10-digit mobile number'
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='feedback-topic'>What is this about? (optional)</Label>
                  <Input
                    id='feedback-topic'
                    placeholder='e.g. Mandi prices, Schemes page'
                    value={form.topic}
                    onChange={handleChange('topic')}
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='feedback-details'>Your feedback</Label>
                  <Textarea
                    id='feedback-details'
                    placeholder='What did you like? What should we improve?'
                    rows={4}
                    value={form.details}
                    onChange={handleChange('details')}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant='ghost' onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid || isSubmitting}
                  className='bg-green-800 text-white hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-500'
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className='flex flex-col items-center gap-3 py-6 text-center'>
              <div className='flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300'>
                <Icon className='size-6' />
              </div>
              <DialogTitle>Thank you!</DialogTitle>
              <p className='text-sm text-muted-foreground'>
                We got your feedback. Thank you for helping us improve.
              </p>
              <Button
                onClick={closeDialog}
                className='mt-2 bg-green-800 text-white hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-500'
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Card14
