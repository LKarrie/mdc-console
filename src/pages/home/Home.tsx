import BarChartBox from "../../component/barChartBox/BarChartBox"
import BigChartBox from "../../component/bigChartBox/BigChartBox"
import Bread from "../../component/bread/Bread"
import ChartBox from "../../component/chartBox/ChartBox"
import PieChartBox from "../../component/pieChartBox/PieChartBox"
import TopBox from "../../component/topBox/TopBox"
import "./home.scss"

const Home = () => {
  return (
    <div className="home">
      <div className="box box1">
        <TopBox/>
      </div>
      <div className="box box2"><ChartBox/></div>
      <div className="box box3"><ChartBox/></div>
      <div className="box box4"><PieChartBox/></div>
      <div className="box box5"><ChartBox/></div>
      <div className="box box6"><ChartBox/></div>
      <div className="box box7"><BigChartBox/></div>
      <div className="box box8"><BarChartBox/></div>
      <div className="box box9"><BarChartBox/></div>
    </div>
  )
}

export default Home
