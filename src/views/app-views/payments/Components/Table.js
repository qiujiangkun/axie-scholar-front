import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Table } from "antd";
import styled from "styled-components";
import { Claimed, Notavailable, Pending, Claimable, Failed, Error } from "./ClaimStatus";
import { Paid, Unpaid, Pending as Pending1, Error as Error1, PendingPayment } from "./PaymentStatus";
import Loader from "react-loader-spinner";
import { Select } from 'antd';
const { Option } = Select;

const Wrapper = styled.div`
  margin-top: 30px;
  position: relative;
`;

const BtnEdit = styled.div`
  background: #ffffff;
  border: 1px solid #ff8b00;
  box-sizing: border-box;
  border-radius: 12px;
  color: #ff8b00;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const BtnDel = styled.div`
  margin-top: 5px;
  background: #ff9898;
  border: 1px solid #ff8b00;
  box-sizing: border-box;
  border-radius: 12px;
  color: #ffffff;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const DataText = styled.div`
  font-family: Neue;
  font-style: normal;
  font-weight: 500;
  font-size: 13.33px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: #252733;
`;

const TableCustom = styled(Table)`
  .ant-table {
    border: 1px solid #dddfe5;
    box-sizing: border-box;
    border-radius: 12px;
    padding: 15px 25px;
  }

  &.ant-table-thead {
    background: linear-gradient(0deg, #fafafa, #fafafa);
    border-radius: 12px;
  }
`;

const Paging = styled.div`
  font-family: Neue;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
  color: #9d9b9c;
  position: absolute;
  bottom: 0;

  & > b {
    color: #1a3353;
  }

  @media only screen and (max-width: 576px) {
    display: none;
  }
`;

const MAPPING_ICON = [
  <Unpaid />,
  <Paid />,
  <Pending1 />,
  <PendingPayment />,
  <Error1 />
];

const LeaderboardData = [
  {
    key: "1x",
    Name: "John Brown",
    date: "11/18 22:53",
    statusClaim: true,
    totalAcc: "2343 SLP",
    scholarShare: "1343 SLP",
    managerShare: "1000 SLP",
    paymentStatus: "paid",
    destinationMatch: "Perfect",
  },
  {
    key: "2x",
    Name: "John Brown",
    date: "11/18 22:53",
    statusClaim: false,
    totalAcc: "2343 SLP",
    scholarShare: "1343 SLP",
    managerShare: "1000 SLP",
    paymentStatus: "unpaid",
    destinationMatch: "HoldOn",
  }
];

function TableData({onEdit, onDelete, loading, rowSelection}) {
  const LeaderboardColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "Name",
      align: "left",
      sorter: (a, b) => a.name - b.name,
      render: (text, row) => <DataText><a href={"https://explorer.roninchain.com/address/" + row.address} target="_blank">{text}</a></DataText>,
    },
    {
      title: "Next Claim",
      dataIndex: "next",
      key: "date",
      align: "left",
      sorter: (a, b) => a.next - b.next,
      render: (text, row) => <DataText>{
        !row.total && row.total != 0 ? "...":
        text ? (new Date(text).getMonth() + 1) + "/" + new Date(text).getDate() + " " + new Date(text).getHours() + ":" + new Date(text).getMinutes() : ""}</DataText>,
    },
    {
      title: "Claim Status",
      dataIndex: "claim_status",
      key: "statusClaim",
      align: "center",
      sorter: (a, b) => a.claim_status - b.claim_status,
      render: (statusClaim, row) => (
        <div className="d-flex justify-content-center align-items-center	">
          {!row.total && row.total != 0 ? "...":
           statusClaim == 0 ? <Notavailable/>:
           statusClaim == 1 ? <Claimed />: 
           statusClaim == 2 ? <Pending />:
           statusClaim == 3 ? <Claimable/>:
           statusClaim == 4 ? <Failed/>:
           <Error />}
        </div>
      ),
    },
    {
      title: "Account Total",
      dataIndex: "total",
      key: "totalAcc",
      align: "center",
      render: (text, row) => <DataText>{
        !row.total && row.total != 0 ? "...": text
      }</DataText>,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Scholar Share",
      dataIndex: "scholar",
      key: "scholarShare",
      align: "center",
      sorter: (a, b) => a.scholar - b.scholar,
      render: (text, row) => <DataText>{!row.total && row.total != 0 ? "...": text}</DataText>,
    },
    {
      title: "Manager Share",
      dataIndex: "manager",
      key: "managerShare",
      align: "center",
      sorter: (a, b) => a.manager - b.manager,
      render: (text, row) => <DataText>{!row.total && row.total != 0 ? "...": text}</DataText>,
    },
    {
      title: "Payment Status",
      dataIndex: "pay_status",
      key: "paymentStatus",
      align: "center",
      sorter: (a, b) => a.pay_status - b.pay_status,
      render: (paymentStatus, row) => (
        <div className="d-flex justify-content-center align-items-center	">
          {!row.total && row.total != 0 ? "...": MAPPING_ICON[paymentStatus]}
        </div>
      ),
    },
    {
      title: "Destination Match",
      dataIndex: "hash",
      key: "destinationMatch",
      align: "center",
      render: (hash, row) => <span>
        {!row.total && row.total != 0 ? "...": (
          <>
        {hash && hash[0] ? <div><a href={"https://explorer.roninchain.com/tx/" + hash[0]} target="_blank">{hash[0].substr(0,6) + "..." + hash[0].substr(-4)}</a><br/></div> : ""}
        {hash && hash[1] ? <div><a href={"https://explorer.roninchain.com/tx/" + hash[1]} target="_blank">{hash[1].substr(0,6) + "..." + hash[1].substr(-4)}</a><br/></div> : ""}
        {hash && hash[2] ? <div><a href={"https://explorer.roninchain.com/tx/" + hash[2]} target="_blank">{hash[2].substr(0,6) + "..." + hash[2].substr(-4)}</a></div> : ""}
          </>
          )}
      </span>,
    },
    {
      title: "Action",
      align: "center",
      render: (text, row) => <><BtnEdit onClick={() => onEdit(row)}>EDIT</BtnEdit><BtnDel onClick={() => onDelete(row)}>DEL</BtnDel></>
      // <BtnEdit>Edit</BtnEdit>,
    },
  ];

  const [pagination, setPagination] = useState({current: 1, pageSize: 10});
  const scholars = useSelector(state=>state.scholars);

  
  


  useEffect(() => {
		if (localStorage.getItem('table_status')) {
      const tt = JSON.parse(localStorage.getItem('table_status'));
			setPagination(tt);
		}
	}, []);
  
  const onPaginationChange = (pagination) => {
    setPagination(pagination);
    localStorage.setItem('table_status', JSON.stringify(pagination))
  }

  const onPageSizeChange = (value) => {
    setPagination({current: 1, pageSize: value});
    localStorage.setItem('table_status', JSON.stringify({current: 1, pageSize: value}));
  }

  return (
    <Wrapper>
      {loading ? 
        <Loader
          type="Oval"
          color="#00BFFF"
          height={100}
          width={100}
          className="text-center"
        />
        : <>
        <TableCustom
          rowKey="key"
          pagination={pagination}
          rowSelection={rowSelection}
          columns={LeaderboardColumns}
          dataSource={scholars}
          onChange={onPaginationChange}
        />
        {scholars.length > 0 ? (
          <Paging>
            <Select defaultValue={pagination.pageSize} style={{ width: 120, marginRight: 30 }} onChange={onPageSizeChange}>
              <Option value="5">5</Option>
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="50">50</Option>
              <Option value="10000">All</Option>
            </Select>
            Showing <b>{pagination.pageSize*(pagination.current-1)+1}-{Math.min(pagination.pageSize*pagination.current, scholars.length)}</b> from <b>{scholars.length}</b> data
          </Paging>
        ) : ("")}
        
        </>
      }
      
    </Wrapper>
  );
}

export default TableData;
