import {fireEvent,render,screen,waitFor} from '@testing-library/react'
import {beforeEach,describe,expect,it,vi} from 'vitest'
import {OrderReviewAction} from '@/components/order-review-action'
const refresh=vi.fn()
vi.mock('next/navigation',()=>({useRouter:()=>({refresh})}))
describe('OrderReviewAction',()=>{beforeEach(()=>{refresh.mockReset();vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({order:{state:'quote_pending'}})}))});it('requests review with version and no price or internal source',async()=>{render(<OrderReviewAction orderId="order-1" version={4}/>);fireEvent.click(screen.getByRole('button',{name:'Solicitar revisión'}));await waitFor(()=>expect(refresh).toHaveBeenCalled());const[,request]=vi.mocked(fetch).mock.calls[0];expect(JSON.parse(String(request?.body))).toEqual({expectedVersion:4});expect(String(request?.body)).not.toMatch(/price|delivery|partner/i)})})
