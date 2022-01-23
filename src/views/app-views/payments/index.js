import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ContentBanner from "components/shared-components/ContentBanner";
import { Row, Col } from "antd";
import styled, {css} from "styled-components";
import SearchSection from "./Components/SearchSection";
import NodeButton from "./Components/NodeButton";
import TableData from "./Components/Table";
import PaymentModal from "./Components/PaymentModal";
import * as XLSX from 'xlsx';
import utils from 'utils';
import { authHeader } from "helpers";
import RJSSocket from './Components/RJSSocket';
import { toast } from 'react-toastify';
import fileDownload from 'js-file-download';
import { Button } from "antd";
const ListBtnSection = styled.div`
  margin-top: 30px;
`;
const Wrapper = styled(Button)`
  width: 100%;
  height: 34px;
  background: #ffffff;
  border: 1px solid #ff8b00;
  box-sizing: border-box;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #ff8b00;
  white-space: nowrap;
  padding: 10px;

  ${(props) =>
    props.iswarning &&
    css`
      background: #e43700;
      color: #ffffff;
    `};

  @media only screen and (max-width: 576px) {
    font-size: 11.1392px;
  }
`;
const IconPay = () => (
  <svg
    width="49"
    height="60"
    viewBox="0 0 49 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30.8407 0.757812H6.74978C3.43728 0.757812 0.727051 3.4169 0.727051 6.6669V53.9396C0.727051 57.1896 3.43728 59.8487 6.74978 59.8487H42.8861C46.1986 59.8487 48.9089 57.1896 48.9089 53.9396V18.4851L30.8407 0.757812ZM33.8521 27.3487H21.8066V30.3033H30.8407C32.4969 30.3033 33.8521 31.6328 33.8521 33.2578V42.1214C33.8521 43.7464 32.4969 45.076 30.8407 45.076H27.8293V48.0305H21.8066V45.076H15.7839V39.1669H27.8293V36.2124H18.7952C17.139 36.2124 15.7839 34.8828 15.7839 33.2578V24.3942C15.7839 22.7692 17.139 21.4396 18.7952 21.4396H21.8066V18.4851H27.8293V21.4396H33.8521V27.3487Z"
      fill="#FF8B00"
    />
  </svg>
);

const IconPending = () => (
  <svg
    width="54"
    height="55"
    viewBox="0 0 54 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M33.75 33.3199L41.58 37.9099L39.42 41.4199L29.7 35.4799V21.9799H33.75V33.3199ZM54 32.7799C54 44.6869 44.307 54.3799 32.4 54.3799C26.946 54.3799 21.978 52.3279 18.171 48.9799H5.4C2.295 48.9799 0 46.6849 0 43.5799V19.2799C0 16.2559 2.403 13.9879 5.4 13.8799V12.5299C5.4 5.80688 10.827 0.379883 17.55 0.379883C23.868 0.379883 28.998 5.21288 29.592 11.3959C30.51 11.2609 31.455 11.1799 32.4 11.1799C44.307 11.1799 54 20.8729 54 32.7799ZM10.8 13.8799H24.3V11.8819C23.976 8.45288 21.06 5.77988 17.55 5.77988C13.824 5.77988 10.8 8.80388 10.8 12.5299V13.8799ZM48.6 32.7799C48.6 23.8429 41.337 16.5799 32.4 16.5799C23.463 16.5799 16.2 23.8429 16.2 32.7799C16.2 41.7169 23.463 48.9799 32.4 48.9799C41.337 48.9799 48.6 41.7169 48.6 32.7799Z"
      fill="#FF8B00"
    />
  </svg>
);

const IconUnpaid = () => (
  <svg
    width="56"
    height="50"
    viewBox="0 0 56 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 49.8799H56L28 0.879883L0 49.8799ZM30.5455 42.143H25.4545V36.9851H30.5455V42.143ZM30.5455 31.8273H25.4545V21.5115H30.5455V31.8273Z"
      fill="#FF8B00"
    />
  </svg>
);

function Payments() {

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const dispatch = useDispatch();
  const scholars = useSelector(state=>state.scholars);
  const [modalInfo, setModalInfo] = useState({});
	let history = useHistory();

  const rowSelection = {
    selectedRowKeys,
    onChange: (selected)=>{
      console.log(selected);
      setSelectedRowKeys(selected);
    },
  };

  const [listDetail] = useState([
    { icon: IconPay, number: "$134,023", text: "Paid" },
    { icon: IconPending, number: "$2,230", text: "Pending" },
    { icon: IconUnpaid, number: "$1,660", text: "Unpaid" },
  ]);

  const onDeleteClick = () => {
    console.log(selectedRowKeys)
    if(selectedRowKeys.length == 0) {
      toast.warn("You selected nothing");
      return;
    }
      setLoading(true);
      fetch(process.env.REACT_APP_BACKEND_API + '/api/scholars/' + JSON.stringify(selectedRowKeys), {method: 'DELETE', headers: authHeader()}).then(resp => {
        if(resp.status == 403) history.push('/auth/login')
        return resp.json();
      }).then(res => {
        dispatch({type: "DELETE_SCHOLARS", payload: selectedRowKeys});
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        setLoading(false);
      })
  }

  const onClaimClick = () => {
    if(selectedRowKeys.length == 0) {
      toast.warn("You selected nothing");
      return;
    }
    const addresses = scholars.filter(row => selectedRowKeys.indexOf(row.id) !== -1).map(row => row.address);
      console.log(addresses);
      fetch(process.env.REACT_APP_BACKEND_API + '/api/claim', {
        method: 'POST',
        body: JSON.stringify({ addresses }),
        headers: {...authHeader(), 'Content-Type': 'application/json'}
      }).then(resp=>{
        if(resp.status == 403) history.push('/auth/login')
        return resp.json(); 
      }).then(res => {
        dispatch({type: "UPDATE_SCHOLARS", payload: res})
      }).catch(err => {
        console.log(err);
      })
  }

  const onPayClick = () => {
    if(selectedRowKeys.length == 0) {
      toast.warn("You selected nothing");
      return;
    }
    const addresses = scholars.filter(row => selectedRowKeys.indexOf(row.id) !== -1).map(row => row.address);
      console.log(addresses);
      fetch(process.env.REACT_APP_BACKEND_API + '/api/pay', {
        method: 'POST',
        body: JSON.stringify({ addresses }),
        headers: {...authHeader(), 'Content-Type': 'application/json'}
      }).then(resp=>{
        if(resp.status == 403) history.push('/auth/login')
        return resp.json();
      }).then(res => {
        dispatch({type: "UPDATE_SCHOLARS", payload: res})
      }).catch(err => {
        console.log(err);
      })
  }

  const onRefreshClick = () => {
    if(selectedRowKeys.length) {
      fetch(process.env.REACT_APP_BACKEND_API + '/api/scholars/refresh/' + JSON.stringify(selectedRowKeys), {method: "POST"}).then(resp => {
        console.log(resp.status);
        dispatch({type: "UPDATE_SCHOLARS", payload: selectedRowKeys.map(id=>{
          return {id: id, total: null, balance: null, last_time: null};
        })})
      }).catch(err => {
        console.log(err);
      })
    } else {
      updateTable();
    }
  }

  const onViewLogsClick = () => {
    const sendData = {
      start_date: Date.now() - 30 * 24 * 3600 * 1000,
      end_date: Date.now(),
    }

    fetch(`${process.env.REACT_APP_BACKEND_API}/api/scholars/download_csv_file`, {method: "POST", body: JSON.stringify(sendData), headers: {...authHeader(), 'Content-Type': 'application/json'}}).then(resp => resp.json()).then(res => {
      fetch(`${process.env.REACT_APP_BACKEND_API}/${res.path}`, {
        method: "GET",
        headers: {responseType: 'blob'}
      }).then(resp => resp.text()).then(res => {
        fileDownload(res, 'logs.csv');
      })
    })
  }

  const [isShowModal, setIsShowModal] = useState(false);

  const showModal = () => {
    setModalInfo({
      address: "",
      address1: "",
      address2: "",
      id: -1,
      name: "",
      private: "",
      total: 0,
      rule: [[2011,30],[2386,40],[10000,45]]
    });
    setIsShowModal(true);
  };

  const closeModal = () => {
    setIsShowModal(false);
  };

  const handleCancel = () => {
    setIsShowModal(false);
  };

  const updateTable = () => {
		setLoading(true);
		fetch(process.env.REACT_APP_BACKEND_API + '/api/scholars', {method: 'GET', headers: authHeader()}).then(resp => {
      if(resp.status == 403) history.push('/auth/login')
      return resp.json()
    }).then(res => {
			dispatch({type: "SET_SCHOLARS", payload: res});
		}).catch(err => {
			console.log("ERR", err.message);
		}).finally(() => {
			setLoading(false);
		})
  }

  useEffect(() => {
		updateTable();
  }, []);
  
  const readExcelFile = (event) => {
    if (event.target.files.length == 0) return;
		const f = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (evt) => { // evt = on_file_select event
			/* Parse data */
			const bstr = evt.target.result;
			const wb = XLSX.read(bstr, { type: 'binary' });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
			/* Update state */

			const new_data = data.filter(row => {
				return row[0] * 1 == row[0];
			}).map(row => {
				if (row[2]) row[2] = utils.encrypt(row[2]);
				return row;
			});
			if (new_data.length > 0) {
        setLoading(true);
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify({ scholars: new_data }),
          headers: {...authHeader(), 'Content-Type': 'application/json'}
        };
				fetch(`${process.env.REACT_APP_BACKEND_API}/api/scholars/bulk_upload`, requestOptions).then(resp => {
          if(resp.status == 403) history.push('/auth/login')
          return resp.json();
        }).then(res => {
					dispatch({type: "ADD_SCHOLARS", payload: res});
					event.target.files = null;
				}).catch(err => {
          console.log("ERR", err.message);
        }).finally(() => {
          setLoading(false);
        })
			}
		};
		reader.readAsBinaryString(f);
  }

  const onDelete = (row) => {
    setLoading(true);
		fetch(process.env.REACT_APP_BACKEND_API + '/api/scholars/' + row.id, {method: 'DELETE', headers: {...authHeader(), 'Content-Type': 'application/json'}}).then(resp => {
      if(resp.status == 403) history.push('/auth/login')
      return resp.json();
    }).then(res => {
			dispatch({type: "DELETE_SCHOLAR", payload: row.id});
		}).catch(err => {
			console.log(err);
		}).finally(() => {
			setLoading(false);
		})
  }

  const onEdit = (row) => {
    setModalInfo(row);
    setIsShowModal(true);
  }

  return (
    <div>
      <Row gutter={[32, 8]}>
        {listDetail.map((item, i) => (
          <Col lg={8} md={24} sm={24} xs={24} key={i}>
            <ContentBanner
              iconSvg={item.icon}
              number={item.number}
              text={item.text}
            />
          </Col>
        ))}
      </Row>

      <SearchSection showModal={showModal} />

      <ListBtnSection>
        <Row gutter={[16, 8]}>
          <Col lg={4} md={0} sm={0} xs={0}>
              <Wrapper>
                <label style={{width: "100%"}}>      
                  UPLOAD FROM EXCEL
                  <input type="file" style={{ display: 'none' }} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={readExcelFile} />
                </label>  
              </Wrapper>
          </Col>
          <Col lg={4} md={0} sm={0} xs={0}>
            <Wrapper onClick={onViewLogsClick}>
              VIEW LOGS
            </Wrapper>
          </Col>
          <Col lg={4} md={0} sm={0} xs={0}>
            <Wrapper onClick={onRefreshClick}>
              {selectedRowKeys.length ? 'REFRESH SELECTED ONES(' + selectedRowKeys.length + ')': 'REFRESH ALL'}
              
            </Wrapper>
          </Col>
          <Col lg={4} md={0} sm={0} xs={0}>
            <Wrapper onClick={onClaimClick}>
              CLAIM REWARDS
            </Wrapper>
          </Col>
          <Col lg={4} md={0} sm={0} xs={0}>
            <Wrapper onClick={onPayClick}>
              PAY
            </Wrapper>
          </Col>
          <Col lg={4} md={0} sm={0} xs={0}>
            <Wrapper iswarning="true" onClick={onDeleteClick}>
              DELETE
            </Wrapper>
          </Col>
        </Row>
      </ListBtnSection>

      <RJSSocket updateTable={updateTable}/>

      <TableData onDelete={onDelete} onEdit={onEdit} loading={loading} rowSelection={rowSelection}/>

      {/* Modal section */}
      <PaymentModal
        modalInfo={modalInfo}
        isShowModal={isShowModal}
        setLoading={setLoading}
        closeModal={closeModal}
        handleCancel={handleCancel}
      />
    </div>
  );
}

export default Payments;
