import React, {useCallback,useEffect } from 'react';
import { Paths } from 'paths';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TitleBar from 'components/titlebar/TitleBar';
import styles from './MyPage.module.scss';
import styled from 'styled-components';
import Profile from 'components/svg/sign/profile.png';
import BottomNav from 'components/nav/BottomNav';
import classNames from 'classnames/bind';
import { localLogout } from '../../api/auth/auth';
import { logout } from '../../store/auth/auth';
import Button from '@material-ui/core/Button';
import { numberFormat } from '../../lib/formatter';
import Back from 'components/svg/header/Back';
import { Link } from 'react-router-dom';
import {useInit} from '../../hooks/useStore';
import {noAuthGetNearStore} from '../../api/noAuth/store';

const cx = classNames.bind(styles);

const MyPageContainer = () => {
    const initStore = useInit();
    const { user } = useSelector((state) => state.auth);
    const user_token = sessionStorage.getItem("access_token");
    const dispatch = useDispatch();
    const history = useHistory();

    const onClickLogout = useCallback(async () => {
        try{
            const res = await localLogout(user_token);
            sessionStorage.removeItem('access_token');
            if (res.message === '로그아웃에 성공하셨습니다.') {
                dispatch(logout());
                initStore();
                history.replace(Paths.index);

                const noAuthAddrs = JSON.parse(localStorage.getItem('noAuthAddrs'));
                if(noAuthAddrs){
                    const index = noAuthAddrs.findIndex((item) =>item.active===1);
                    if(index!==-1){
                        const {addr1, addr2,lat,lng,post_num} = noAuthAddrs[index];
                        const near_store = await noAuthGetNearStore(lat,lng,addr1);
                        initStore(addr1,addr2,lat,lng,post_num,near_store.data.query );
                    }
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    },[dispatch,history,user_token]);

    const onClickLogin = useCallback(() => {
        history.push(Paths.ajoonamu.signin);
    }, [history]);
    const onClickAccount = useCallback(() => {
        history.push(Paths.ajoonamu.account);
    }, [history]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className={styles['container']}>
                <Button
                    className={styles['user-info']}
                    onClick={user ? onClickAccount : onClickLogin}
                >
                    <div className={cx('profile', 'pd-left')}>
                        <img src={Profile} alt={'이미지'} />
                    </div>
                    <div className={cx('info', 'pd-box')}>
                        <div className={styles['auth']}>
                            {user ? (
                                <div className={styles['name']}>
                                    <span>{user.name}</span> 님 반갑습니다!
                                </div>
                            ) : (
                                '로그인을 해주세요'
                            )}
                        </div>
                        {user && (
                            <div className={styles['point']}>
                                <span className={styles['name']}>
                                    보유 포인트
                                </span>
                                <span className={styles['value']}>
                                    {numberFormat(user.point)}P
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={cx('link', 'pd-right')}>
                        <Back rotate="180deg" />
                    </div>
                </Button>
                <div className={styles['tab']}>
                    <Item url={`${Paths.ajoonamu.support}/notice`} text={'공지사항'} />
                    <Item url={Paths.ajoonamu.event} text={'이벤트'} />
                    <Item url={`${Paths.ajoonamu.support}/faq`} text={'자주 묻는 질문'} />
                    <Item url={`${Paths.ajoonamu.support}/qna/send`} text={'1:1 문의'} />
                    <Item text={'알림설정'} />
                    <Item text={'버전정보'} version />
                    {user && <Item text={'이용약관'}url={`${Paths.ajoonamu.tos}?tab=0`}/>}
                </div>
                {user && (
                    <div className={styles['logout']} >
                        <Button className={styles['logout-btn']} onClick={onClickLogout}>
                            <div className={styles['pd-btn']}>로그아웃</div>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

const Item = ({ text, url, version }) => {
    const history = useHistory();
    return (
        <Button
            className={styles['pd-box']}
            onClick={url ? () => history.push(url) : version ? () => {} : () => alert('준비중입니다.')}
        >
            <div className={styles['item']}>
                {text}
            </div>
            {version && <div className={styles['version']}>
                0.01 ver
            </div>}
        </Button>
    );
};


export default MyPageContainer;
