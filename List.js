import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { detail } from '../actions/apost';
import M_buildings from "../buildings/M_buildings"
import Y_buildings from "../buildings/Y_buildings"

const List = ({ isAuthenticated, lists, detail }) => {
    
    const [searchItem, setSearchItem] = useState("");
    
    const [selectedFilter, setSelectedFilter] = useState({
        lost_found:'',
        campus:'',
        building:'',
        item:'',
        color:'',
        date:''
    });

    const [filterList, setFilterList] = useState(lists);

    const [buildingList, setBuildingList] = useState([<option value="">학관</option>]);

    const seoul = M_buildings.datas.map((building) => building.name);
    seoul.push("교외 (학교 주변)");
    const suwon = Y_buildings.datas.map((building) => building.name);
    suwon.push("교외 (학교 주변)");
    
    const {lost_found, campus, building, item, color, date} = selectedFilter;

    if (!isAuthenticated) {
        return <Redirect to = '/login' />
    }

    const handleSearch = (e) => {
        setSearchItem(e.target.value);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        let searchList = lists;
        if (searchItem) {
            searchList = searchList.filter((list) => list.campus.match(searchItem));
            console.log(searchList);
            console.log(typeof(searchList));
            if (Object.keys(searchList).length === 0) {
                searchList = lists;
                searchList = searchList.filter((list) => list.content.match(searchItem));
                
            }
        }
        setFilterList(searchList);
    }

    const filtering = () => {
        let filteringList = lists;
        if (lost_found) {
            filteringList = filteringList.filter((list) => list.lost_found === lost_found);
        }
        if (campus) {
            console.log("check");
            filteringList = filteringList.filter((list) => list.campus === campus);
        }
        if (building) {
            filteringList = filteringList.filter((list) => list.building === building);
        }
        if (item) {
            filteringList = filteringList.filter((list) => list.item === item);
        }
        if (color) {
            filteringList = filteringList.filter((list) => list.color === color);
        }
        if (date) {
            filteringList = filteringList.filter((list) => list.date === date);
        }
        setFilterList(filteringList);
    }

    const handleChange = (e) => {
        setSelectedFilter({...selectedFilter, [e.target.name]: e.target.value});
        console.log(e.target.name, e.target.value);
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
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.dir(selectedFilter);
        filtering();
    }

    let renderList = filterList.map((list) => {

        return (
            <div key={list.id}>
                <div>
                    <Link
                        to={{pathname: `/list/${list.id}`}}
                        onMouseDown={e => getDetail(list.id, e)}
                        >
                        <p>
                            <img src={list.image} width='100'/>
                            <div>{list.title}</div>
                            <div>{list.campus}</div>
                            <div>{list.location}</div>
                        </p>
                    </Link>
                </div>
            </div>
        );
    });

    const getDetail = (id, e) => {
            detail(id);
        };

    return(
        <div className='container mt-5'>
            <h1>유실물 목록</h1>
            <form onSubmit= {e => handleSearchSubmit(e)}>
                <input
                    type="text"
                    placeholder="찾으시는 물품을 검색해보세요"
                    value={searchItem}
                    onChange= {e => handleSearch(e)}
                />
                <input type="submit" value="검색" />
            </form>
            <form onSubmit={e => handleSubmit(e)}>
                <label>
                    FILTER
                    <select name="lost_found" value={lost_found} onChange= {e => handleChange(e)}>
                        <option value="">분실/습득</option>
                        <option value="분실물">분실물</option>
                        <option value="습득물">습득물</option>
                    </select>
                    <select name="campus" value={campus} onChange= {e => handleChange(e)}>
                        <option value="">캠퍼스</option>
                        <option value="명륜">명륜</option>
                        <option value="율전">율전</option>
                    </select>
                    <select name="building" value={building} onChange= {e => handleChange(e)}>
                        {buildingList};
                        
                    </select>
                    <select name="item" value={item} onChange= {e => handleChange(e)}>
                        <option value="">물품 종류</option>
                        <option value="전자기기">전자기기</option>
                        <option value="지갑/잡화류">지갑/잡화류</option>
                        <option value="카드/신분증">카드/신분증</option>
                        <option value="기타">기타</option>
                    </select>
                    <select name="color" value={color} onChange= {e => handleChange(e)}>
                        <option value="">색상</option>
                        <option value="빨간색">빨간색</option>
                        <option value="파란색">파란색</option>
                    </select>
                    <input type="date" placeholder="날짜" name="date" value={date} onChange = {e => handleChange(e)}></input>
                </label>
                <input type="submit" value="Submit" />
            </form>
            <p>{ renderList }</p>
            <p></p>
            <p className='mt-3'></p>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    lists: state.post._datas
});

export default connect(mapStateToProps, {detail})(List);