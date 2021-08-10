import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { read } from '../actions/post';
import { create } from '../actions/apost';
import Map from '../components/Map';
import M_buildings from "../buildings/M_buildings"
import Y_buildings from "../buildings/Y_buildings"

const Create = ({ read, create, isAuthenticated, _user }) => {
    
    const [postCreated, setPostCreated] = useState(false);
    const [imageData, setImageData] = useState({ image: null });
    const [postData, setPostData] = useState({
        lost_found: '',
        title: '',
        campus: '',
        building: '',
        latitude: '',
        longitude: '',
        address: '',
        location: '',
        date: '',
        item: '',
        color: '',
        content: ''
    });

    const { lost_found, title, campus, building, latitude, longitude, address, location, date, item, color, content } = postData;
    const { image } = imageData;

    const [buildingList, setBuildingList] = useState([<option value="">선택</option>]);

    const seoul = M_buildings.datas.map((building) => building.name);
    seoul.push("교외 (학교 주변)");
    const suwon = Y_buildings.datas.map((building) => building.name);
    suwon.push("교외 (학교 주변)");
    
    const onChangeImage = (e) => {
        setImageData({ ...imageData, [e.target.name]: e.target.files[0] });
    };

    const onChangeBuilding = (e) => {

        if (e.target.value !== '' && e.target.value !== '교외 (학교 주변)') {
            // 명륜 캠퍼스 내 학관 골랐을 시 지도 자동 생성
            if (campus === '명륜') {
                M_buildings.datas.map((data) => {
                    if (e.target.value === data.name) {
                        setPostData({
                            ...postData,
                            [e.target.name]: e.target.value,
                            ['latitude']: data.latitude,
                            ['longitude']: data.longitude,
                            ['address']: data.address
                        });
                    }
                });
            // 율전 캠퍼스 내 학관 골랐을 시 지도 자동 생성
            } else if (campus === '율전') {
                Y_buildings.datas.map((data) => {
                    if (e.target.value === data.name) {
                        setPostData({
                            ...postData,
                            [e.target.name]: e.target.value,
                            ['latitude']: data.latitude,
                            ['longitude']: data.longitude,
                            ['address']: data.address
                        });
                    }
                });
            }
        } else {
            setPostData({
                ...postData,
                [e.target.name]: e.target.value,
                ['latitude']: '',
                ['longitude']: '',
                ['address']: ''
            });
        }
    };

    const onChange = (e) => {
        if (e.target.name === "campus") {
            let elemArray=[];
            if (e.target.value === "명륜") {
                for (let i = 0; i < seoul.length; i++) {
                    elemArray.push(<option value={seoul[i]}>{seoul[i]}</option>);
                }
                
            } else if (e.target.value === "율전") {
                for (let i = 0; i < suwon.length; i++) {
                    elemArray.push(<option value={suwon[i]}>{suwon[i]}</option>);
                }

            }
            setBuildingList(elemArray);
        }
        setPostData({ ...postData, [e.target.name]: e.target.value });
    };

    const onSubmit = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user', _user.id);
        formData.append('lost_found', lost_found);
        formData.append('title', title);
        formData.append('campus', campus);
        formData.append('building', building);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('address', address);
        formData.append('location', location);
        formData.append('date', date);
        formData.append('item', item);
        formData.append('color', color);
        formData.append('image', image);
        formData.append('content', content);

        console.dir(postData);
        create(formData);
        setTimeout(read,1000);
        setPostCreated(true);
    };

    const getAddress = (latitude, longitude, address) => {
        setPostData({
            ...postData,
            ['latitude']: latitude,
            ['longitude']: longitude,
            ['address']: address
        });
    };

    // 로그인 안 했을 시 로그인 페이지로
    if (!isAuthenticated) {
        return <Redirect to = '/login' />
    }

    // 게시물 등록했을 시 목록 페이지로
    if (postCreated) {
        return <Redirect to = '/list' />
    }

    return(
        <div className='container mt-5'>
            <h1>유실물 등록</h1>
            <p></p>
            <form onSubmit={e => onSubmit(e)}>
                <div>
                    <label></label>
                    <select name="lost_found" value={lost_found} onChange= {e => onChange(e)}>
                        <option value="">분실/습득</option>
                        <option value="분실물">분실물</option>
                        <option value="습득물">습득물</option>
                    </select>
                </div>
                <div>
                    <label>분실 캠퍼스</label>
                    <select name="campus" value={campus} onChange= {e => onChange(e)}>
                        <option value="">선택</option>
                        <option value="명륜">명륜</option>
                        <option value="율전">율전</option>
                    </select>
                </div>
                <div>
                    <label>분실 건물</label>
                    <select name="building" value={building} onChange= {e => onChangeBuilding(e)}>
                        {buildingList};
                    </select>
                </div>
                    {address} 
                    <Map mapHandler={getAddress} />
                <div>
                    <label>물품 종류</label>
                    <select name="item" value={item} onChange= {e => onChange(e)}>
                        <option value="">선택</option>
                        <option value="전자기기">전자기기</option>
                        <option value="지갑/잡화류">지갑/잡화류</option>
                        <option value="카드/신분증">카드/신분증</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div>
                    <label>물품 색상</label>
                    <select name="color" value={color} onChange= {e => onChange(e)}>
                        <option value="">색상</option>
                        <option value="빨간색">빨간색</option>
                        <option value="파란색">파란색</option>
                    </select>
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='date'
                        placeholder='날짜'
                        name='date'
                        value={date}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='file'
                        accept='image/*'
                        name='image'
                        onChange={e => onChangeImage(e)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <textarea
                        className='form-control'
                        placeholder='내용'
                        name='content'
                        value={content}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <button className='btn btn-primary' type='submit'>등록</button>
            </form>
            <p className='mt-3'></p>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    _user: state.auth.user
});

export default connect(mapStateToProps, { read, create })(Create);