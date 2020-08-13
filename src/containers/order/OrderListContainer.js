import React,{useState} from 'react';
import styles from './OrderList.module.scss';
import { Paths } from 'paths';
import Header from 'components/header/Header';
import TitleBar from 'components/titlebar/TitleBar';
import TabMenu from 'components/tab/TabMenu';
import OrderItem from 'components/order/OrderItem';
import BottomNav from 'components/nav/BottomNav';
import BottomModal from 'components/nav/BottomModal';

import Message from 'components/message/Message';
const tabInit = [
    {
        url: `${Paths.ajoonamu.order_list}/order?`,
        name: '예약주문'
    },
    {
        url: `${Paths.ajoonamu.order_list}/delivery`,
        name: '배달주문'
    },

]


const OrderListContainer = ({ tab = 'order' }) => {
    const [open,setOpen] = useState(false);
    
    const handleOpen =()=>{
        setOpen(true);
    }
    const handleClose =()=>{
        setOpen(false);
    }

    return (
        <>
        <TitleBar title={"주문내역"}/>
            <div className={styles['order-list-tab']}>
                <TabMenu tabs={tabInit} />
                <div className={styles['container']}>
                    {tab === 'order' && <OrderItem />}
                    {tab ==='delivery' && 
                    <Message
                        src={true}
                        msg={"주문 내역이 존재하지 않습니다."}
                        isButton={true}
                        buttonName={"주문하러 가기"}
                    />  
                    }
                </div>
            </div>
            <button onClick={handleOpen}>test</button>
            <BottomNav/>
            <BottomModal
                open ={open}
                handleClose={handleClose}
            />

        </>
    )
}
export default OrderListContainer;