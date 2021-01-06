import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styles from './OrderComplete.module.scss';
import cn from 'classnames/bind';

//components
import DetailOrderItemList from '../../components/order/DetailOrderItemList';
import Loading from '../../components/asset/Loading';
import { ButtonBase } from '@material-ui/core';

//lib
import { numberFormat, stringToTel } from '../../lib/formatter';

//api
import { order_cancle } from '../../api/order/order';
import { getDetailOrderView } from '../../api/order/orderItem';
import { noAuthOrderView, noAutuOrderCancle } from '../../api/noAuth/order';

//hooks
import { useStore } from '../../hooks/useStore';
import { useModal } from '../../hooks/useModal';

const cx = cn.bind(styles);

const payments=['페이플 간편결제','계좌이체','만나서 결제','무통장 입금'];
const pay_type = ['card','transfer','meet','bank'];

const OrderDetailContainer = ({ order_id }) => {
    const openModal = useModal();
    const { user } = useSelector((state) => state.auth);
    const user_token = useStore(false);
    const history = useHistory();
    const [success, setSuccess] = useState(false);
    // const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [order, setOrders] = useState(null);
    const [payinfo, setPayinfo] = useState([]);
    const [od_status ,setOdStatus] = useState('order_apply');
    const [type ,setType] = useState(null);
    const getOrderItemInfo = useCallback(async () => {
        setLoading(true);
        try {
            let res = null;
            if (user_token) {
                res = await getDetailOrderView(user_token, order_id);
            } else {
                res = await noAuthOrderView(order_id);
            }
            const { orders, payinfo } = res;
            if (orders === undefined) {
                openModal(
                    '주문번호가 존재하지 않습니다.',
                    '주문번호를 확인해주세요',
                    () => history.replace('/'),
                );
                setSuccess(false);
            } else {
                setOrders(orders);
                setOdStatus(orders.info[0].od_status);
                setPayinfo(payinfo);
                setType(getPaymentType(orders.settle_case));
                setSuccess(true);
            }
        } catch (e) {
            setSuccess(false);
            openModal(
                '주문번호가 존재하지 않습니다.',
                '주문번호를 확인해주세요',
                () => history.replace('/'),
            );
        }
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id, history, user_token]);

    const getPaymentType = (type) => {
        switch (type) {
            case pay_type[0]:
                return payments[0];
            case pay_type[1]:
                return payments[1];
            case pay_type[2]:
                return payments[2];
            case pay_type[3]:
                return payments[3];
            default:
                return payments[0];
        }
    };

    const userOrderCancle = async () => {
        openModal(
            '해당 상품을 취소하시겠습니까?',
            '취소를 원하시면 예를 눌러주세요',
            async () => {
                setLoading(true);
                try {
                    let res = null;
                    if (user_token) {
                        res = await order_cancle(user_token, order_id);
                    } else {
                        res = await noAutuOrderCancle(
                            order_id,
                            order.info[0].s_hp,
                        );
                    }
                    if (
                        res.data.msg.indexOf('이미 취소 된 거래건 입니다.') !==
                        -1
                    ) {
                        openModal('이미 취소된 거래건 입니다.');
                        setOdStatus('order_cancel');
                    } else {
                        openModal('정상적으로 취소되었습니다.');
                        setOdStatus('order_cancel');
                    }
                } catch (e) {}
                setLoading(false);
            },
            () => {},
            true,
        );
    };

    useEffect(() => {
        if (!order_id) {
            history.replace('/');
        } else {
            getOrderItemInfo();
        }
    }, [order_id, getOrderItemInfo, history]);

    return (
        <>
            {loading ? (
                <Loading open={loading} />
            ) : (
                <>
                    {success && (
                        <div className={styles['container']}>
                            <div className={styles['order-list']}>
                                <div className={styles['title']}>주문상품</div>
                                <div className={styles['list']}>
                                    {order && (
                                        <DetailOrderItemList
                                            items={order.items}
                                            info={order.info}
                                        />
                                    )}
                                </div>
                                <div className={cx('title', 'between')}>
                                    <div>배달 정보</div>
                                    <div className={styles['order-type']}>
                                        {order &&
                                        order.info[0].order_type === 'reserve'
                                            ? '예약주문'
                                            : '배달주문'}
                                    </div>
                                </div>
                                <div className={styles['list']}>
                                    <UserInfo
                                        value1={order && order.info[0].s_name}
                                        value2={
                                            order &&
                                            `${order.s_addr1} ${order.s_addr2}`
                                        }
                                        value3={
                                            order &&
                                            stringToTel(order.info[0].s_hp)
                                        }
                                        value4={`배달요청시간 : ${
                                            order &&
                                            order.info[0].delivery_req_time
                                        }`}
                                    />
                                </div>

                                <div className={styles['title']}>주문정보</div>
                                <div className={styles['list']}>
                                    <UserInfo
                                        value1={order && order.info[0].s_name}
                                        value2={
                                            order &&
                                            stringToTel(order.info[0].s_hp)
                                        }
                                        value3={user && user.email}
                                    />
                                </div>
                                <div className={styles['title']}>매장정보</div>
                                <div className={styles['list']}>
                                    <UserInfo
                                        value1={order && order.shop_name}
                                        value2={
                                            order &&
                                            `${order.shop_addr1} ${order.shop_addr2}`
                                        }
                                        value3={
                                            order && stringToTel(order.shop_hp)
                                        }
                                    />
                                </div>

                                <div className={styles['title']}>결제정보</div>
                                <div className={styles['list']}>
                                    <PaymentInfo
                                        text={'주문번호'}
                                        value={order && order.order_id}
                                    />
                                    <PaymentInfo
                                        text={'주문일시'}
                                        value={order && order.receipt_time}
                                    />
                                    <PaymentInfo
                                        text={'결제방식'}
                                        value={type}
                                    />
                                    <PaymentInfo
                                        text={'결제금액'}
                                        value={
                                            order &&
                                            `${numberFormat(
                                                order.receipt_price,
                                            )}원`
                                        }
                                    />
                                    <PaymentInfo
                                        text={'입금자명'}
                                        value={order && order.info[0].s_name}
                                    />
                                </div>
                                <div className={styles['button-box']}>
                                    <ButtonBase
                                        className={cx('cancle-btn', {
                                            status: (od_status === 'order_cancel' || od_status === 'order_complete' || od_status === 'delivery_complete')
                                        })}
                                        disabled={(od_status === 'order_cancel' || od_status === 'order_complete' || od_status === 'delivery_complete')}
                                        disableRipple={(od_status === 'order_cancel' || od_status === 'order_complete' || od_status === 'delivery_complete')}
                                        onClick={(od_status === 'order_cancel' || od_status === 'order_complete' || od_status === 'delivery_complete')
                                            ? () => {}
                                            : userOrderCancle
                                        }
                                    >
                                        {(od_status === 'order_cancel') ? '주문취소완료'
                                        : (od_status === 'delivery_complete') ? '배달완료'
                                        : (od_status === 'order_complete') ? '주문완료'
                                        : '주문 취소'}
                                    </ButtonBase>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

const UserInfo = ({ value1, value2, value3, value4 }) => (
    <>
        <div className={styles['name']}>{value1}</div>
        <div className={styles['user-info']}>{value2}</div>
        <div className={styles['user-info']}>{value3}</div>
        <div className={styles['user-info']}>{value4}</div>
    </>
);

const PaymentInfo = ({ text, value }) => (
    <div className={styles['payment-info']}>
        <div className={styles['info']}>{text}</div>
        <div className={styles['value']}>{value}</div>
    </div>
);
export default OrderDetailContainer;
