import type { LucideIcon } from 'lucide-react'
import { SparklesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type PromoCard = {
  ctaLabel: string
  icon: LucideIcon
  message: string
  title: string
}

const promoCard: PromoCard = {
  ctaLabel: 'Book a review',
  icon: SparklesIcon,
  message: 'Share your early direction, open questions, or rough ideas and we will help shape them into a clearer next step.',
  title: 'Need feedback on a concept?'
}

const Card14 = () => {
  const Icon = promoCard.icon
  return (
    <Card className='relative max-w-lg border-border/70 shadow-sm'>
      <CardHeader className='items-center pb-3 text-center'>
        <div className='mb-2 flex size-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300'>
          <Icon className='size-5' />
        </div>
        <CardTitle>{promoCard.title}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4 text-center'>
        <p className='text-sm leading-6 text-muted-foreground'>{promoCard.message}</p>
        <Button className='self-center bg-green-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.18),0_8px_18px_rgba(22,101,52,0.24)] hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-500'>
          {promoCard.ctaLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

export default Card14
