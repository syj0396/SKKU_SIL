import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { detail } from '../actions/apost';

const Mypage = ({ lists, _user, isAuthenticated, detail }) => {
  
  let newList = null;

  if (!isAuthenticated) {
    return <Redirect to = '/login' />
  } else {
    newList = lists.filter((list) => list.user === _user.id);
  }

  let renderList = newList.map((list) => {
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
          <h1>{ _user.name }</h1>
          <h2>{ _user.campus }캠퍼스 / { _user.student_id }</h2>
          
          <p>내 분실물, 습득물</p>
          <p>{ renderList }</p>
          <p></p>
          <p className='mt-3'></p>
      </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  lists: state.post._datas,
  _user: state.auth.user
});

export default connect(mapStateToProps, {detail})(Mypage);