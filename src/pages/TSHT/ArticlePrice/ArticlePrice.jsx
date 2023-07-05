import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  ListGroup,
  ListGroupItem,
  CardHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import moment from "moment";
import { Button, Popconfirm } from "antd";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Loader from "../../../Components/Common/Loader";
import { toast } from "react-toastify";
import { Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import {
  getArticlePriceList,
  articlePriceExportExcel,
  getArticleAuthorList,
  getArticleTypeList,
  getAPIListCategory,
} from "../../../helpers/fakebackend_helper";
import FilterQuery from "./FilterQuery";
import Loading from "../../../Components/Common/Loading";

const ArticlePrice = () => {
  const [articlePriceList, setArticlePriceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryAuthor, setQueryAuthor] = useState();
  const [queryType, setQueryType] = useState();
  const [queryCategory, setQueryCategory] = useState();
  const [queryFromDate, setQueryFromDate] = useState();
  const [queryToDate, setQueryToDate] = useState();

  const [query, setQuery] = useState();
  const getData = () => {
    getArticlePriceList(query).then((res) => {
      if (res.data && res.status > 0) {
        setArticlePriceList(res.data.list);
      } else {
        setArticlePriceList([]);
      }
      setLoading(false);
    });
  };
  useEffect(() => {
    getArticlePriceList({
      offset: 0,
      limit: -1,
    }).then((res) => {
      if (res.data && res.status > 0) {
        setArticlePriceList(res.data.list);
      }
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    getData();
  }, [query]);
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "article_title",
      key: "article_title",
      render: (text, record) => (
        <>
          <p>{text}</p>
          <p>Tác giả: {record.author}</p>
        </>
      ),
    },
    {
      title: "Chuyên mục",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Loại bài",
      dataIndex: "article_type_name",
      key: "article_type_name",
    },
    {
      title: "Nhuận bút",
      dataIndex: "",
      key: "price",
      render: (_, record) => (
        <>
          <p>Nội dung: {record.content_quality}</p>
          <p>Ảnh: {record.image_quality} </p>
          <p>Video: {record.video_quality} </p>
          <p>Khác: {record.other_quality}</p>
        </>
      ),
    },
    {
      title: "Ngày xuất bản",
      key: "action",
      render: (text) => <>{moment(text).format("DD/MM/YYYY hh:mm")}</>,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];
  useEffect(() => {
    setLoading(true);
    const data = {
      author_id: queryAuthor ? queryAuthor : "",
      category_id: queryCategory ? queryCategory : "",
      article_type_id: queryType ? queryType : "",
      fromdate: queryFromDate ? queryFromDate : "",
      todate: queryToDate ? queryToDate : "",
      offset: 0,
      limit: -1,
    };
    setQuery(data);
  }, [queryAuthor, queryCategory, queryFromDate, queryType, queryToDate]);
  const handleExportExcel = () => {
    articlePriceExportExcel(query).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Thống Kê Nhuận Bút.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Thống kê nhuận bút" pageTitle="Nhuận bút" />
        <Card>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 30,
            }}
          >
            <FilterQuery
              type="text"
              apiFunction={getArticleAuthorList}
              value={"author"}
              setQuery={setQueryAuthor}
            />
            <FilterQuery
              type="text"
              apiFunction={() => getAPIListCategory(0, -1)}
              value={"category"}
              setQuery={setQueryCategory}
            />
            <FilterQuery
              type="text"
              apiFunction={getArticleTypeList}
              value={"type"}
              setQuery={setQueryType}
            />
            <FilterQuery
              type="date"
              apiFunction={() => {}}
              value={"fromDate"}
              setQuery={setQueryFromDate}
            />
            <FilterQuery
              type="date"
              apiFunction={() => {}}
              value={"toDate"}
              setQuery={setQueryToDate}
            />
            <button
              type="button"
              className="btn btn-success"
              id="create-btn"
              onClick={handleExportExcel}
            >
              Xuất excel
            </button>
          </div>
          <CardBody>
            {loading ? (
              <Loading />
            ) : (
              <Table dataSource={articlePriceList} columns={columns} />
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ArticlePrice;
