import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import styles from './SupportContainer.module.scss';
import classNames from 'classnames/bind';

import TitleBar from '../../components/titlebar/TitleBar';
import TabMenu from '../../components/tab/TabMenu';
import BottomNav from '../../components/nav/BottomNav';

import { Paths } from '../../paths';

import { requestNoticeList } from '../../api/support/notice';
import { requestFAQList } from '../../api/support/faq';
import PostList from '../../components/support/PostList';
import { Button } from '@material-ui/core';
import Loading from '../../components/asset/Loading';
import SwipeableViews from 'react-swipeable-views';
import {useStore} from '../../hooks/useStore';
const cn = classNames.bind(styles);

const tabInit = [
    {
        url: `${Paths.ajoonamu.support}/notice`,
        name: '공지사항',
    },
    {
        url: `${Paths.ajoonamu.support}/faq`,
        name: '자주 묻는 질문',
    },
];

const SupportContainer = ({ tab = 'notice' }) => {
    
    const history = useHistory();
    const [index ,setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [noticeList, setNoticeList] = useState([]);
    const [faqList, setFAQList] = useState([]);
    const [faqType, setFAQType] = useState('회원가입');
    const listData = tab === 'notice' ? noticeList : faqList;
    const emptyMessage = tab === 'notice' ? "공지사항이 존재하지 않습니다." : "등록된 자주 묻는 질문이 없습니다.";

    const onChangeTabIndex = (e, value) => {
        setIndex(value);
    };
    const onChangeSwiperIndex = (index) => {
        setIndex(index);
        const tab= (index===0) ? 'notice' : 'faq';
        history.replace(`${Paths.ajoonamu.support}/${tab}`);
    };


    const getNoticeList = useCallback(async () => {
        /*
            공지사항 불러오기
        */
        setLoading(true);
        try{
            const res = await requestNoticeList(0,1000);
            const { notices } = res;
            setNoticeList(notices);
        }
       
        catch(e){
            console.error(e);
        }   
        setLoading(false);
    }, []);

    const getFAQList = useCallback(async (faq_type) => {
        /*
            자주 묻는 질문 불러오기.
            faq_type에 따라 다른 리스트 불러옴
        */
       try{
        setLoading(true);
        const res = await requestFAQList(faq_type);
        setFAQList(res);
       }
       catch(e){
           console.error(e);
       }
     
        setLoading(false);
    }, []);

    useEffect(() => {
        getNoticeList();
    }, [getNoticeList]);
    
    useEffect(() => {
        getFAQList(faqType);
    }, [getFAQList, faqType]);

    return (
        <>
            <Loading open={loading} />
            <TabMenu tabs={tabInit} index={index} onChange={onChangeTabIndex} />
            <div className={styles['container']}>
                <SwipeableViews
                    enableMouseEvents
                    index={index}
                    onChangeIndex={onChangeSwiperIndex}

                >
                    <div>
                        <PostList
                            listData={listData}
                            emptyMessage={emptyMessage}
                        />
                    </div>

                    <div>
                        <div className={styles['title']}>
                            <h2 className={styles['text']}>자주 묻는 질문</h2>
                        </div>

                        <div className={styles['select-area']}>
                            <Button>
                                <select
                                    className={cn('input-box')}
                                    value={faqType}
                                    onChange={(e) => setFAQType(e.target.value)}
                                >
                                    <option value="회원가입">회원가입</option>
                                    <option value="쿠폰">쿠폰</option>
                                    <option value="결제">결제</option>
                                    <option value="포인트">포인트</option>
                                    <option value="배달">배달</option>
                                    <option value="문구 서비스">
                                        문구 서비스
                                    </option>
                                </select>
                            </Button>
                        </div>
                        <div className={styles['title']}>
                            <h2 className={styles['text']}>{faqType}</h2>
                        </div>
                        <PostList
                            listData={listData}
                            emptyMessage={emptyMessage}
                        />
                    </div>
                </SwipeableViews>
            </div>
        </>
    );
};

export default SupportContainer;
