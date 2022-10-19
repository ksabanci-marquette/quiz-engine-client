import React, {Component} from 'react';
import {Link} from "react-router-dom";
import FirstLevelItem from "../common/FirstLevelItem";
import {Col, Row} from "reactstrap";
import {RightExists} from "../util/Helpers";
import {Button, Modal} from "antd";

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: "homePage",
			iconVisible: true,
			activeMenu: null
		};
		this.onChangeSelected = this.onChangeSelected.bind(this);
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.RightExists=this.RightExists.bind(this);
		this.showModal=this.showModal.bind(this);
		this.handleCancel=this.handleCancel.bind(this);
	}

	RightExists( searchItem){
		let exists=false;
		const authorities=this.props.authorities;
		for (const authority of authorities)
		{
			if (authority.authority.includes(searchItem)) {
				exists=true;
			}
		}
		return exists;
	}

	onChangeSelected(selected, activeMenu, event) {
		this.setState({selected, activeMenu});
	}

	async toggleSidebar() {
		document.body.classList.toggle('sidebar-mini');
		this.props.setOffsetWidth(document.getElementById('sidebarModeButton').children[0].offsetWidth);
		this.state.iconVisible ? await this.setState({iconVisible: false}) : await this.setState({iconVisible: true});
	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleCancel = e => {
		this.setState({
			visible: false,
		});
	};

	render() {
		const selected = this.state.selected;
		return (
			<div className="sidebar">
				<div className="logo" id="sidebar" style={{margin: '0', padding: '4px 0 0 0'}}>
					{!this.state.iconVisible &&
					<Row style={{padding: '0', margin: '0 0 0 10px'}}>
						<a href="/" className="simple-text logo-mini">
							<img style={{padding: '0', margin: '0'}} className="simple-text logo-mini" src={process.env.REACT_APP_CONTEXT_NAME + "/image/quizengine.png"}/>
						</a>
					</Row>}
					{this.state.iconVisible &&
					<Row style={{padding: '0', margin: '0'}}>
						<Col xs='4'>
							<img style={{padding: '0', margin: '0'}} className=" simple-text logo-normal"
								 src={process.env.REACT_APP_CONTEXT_NAME + "/image/quizengine.png"}/>
						</Col>
						<Col xs='8' style={{margin: '0', padding: '8px 66px 0 0', wordBreak: 'initial'}}>
							<p style={{margin: '0', padding: '0', fontSize: '12px'}}>Türk Optisyen - Gözlükçüler Birliği</p>
						</Col>
					</Row>}
					<div className="navbar-minimize">
						<button id='sidebarModeButton' onClick={this.toggleSidebar} style={{marginTop: '10px'}}
								className=" btn btn-simple btn-icon btn-neutral btn-round">
							<i className="now-ui-icons text_align-center visible-on-sidebar-regular"/>
							<i className="now-ui-icons design_bullet-list-67 visible-on-sidebar-mini"/>
						</button>
					</div>
				</div>

				<div className="sidebar-wrapper scrollbar" id="style-7" style={{paddingBottom: "44px"}}>

					<div className="user">
						<div className="photo"><img src={process.env.REACT_APP_CONTEXT_NAME + "/image/avt.png"} alt="Avatar"/></div>
						<div className="info">
							<a data-toggle="collapse" aria-expanded="false" href='#merdo'>
								<span>
									{this.props.currentUser.username && ((this.props.currentUser.username.length>21)?this.props.currentUser.username.toString().substring(0,18)+'...':this.props.currentUser.username)||
									this.props.currentUser.email && ((this.props.currentUser.email.length>21)?this.props.currentUser.email.toString().substring(0,18)+'...':this.props.currentUser.email)}

									<b className="caret"/>
								</span>
							</a>
							<div className="collapse" id='merdo'>
								<ul className="nav">
									<li onClick={(e) => this.onChangeSelected("member", "profil", e)}>
											<Link to={{pathname:'/changePasswordInner'}} >
											<span style={{color: this.state.activeMenu === "Profil" && "#6BD098"}} className="sidebar-mini-icon">Ş</span>
											<span style={{color: this.state.activeMenu === "Profil" && "#6BD098"}} className="sidebar-normal">Şifre Değiştir</span>
										</Link>
									</li>

									<li>
										<Link onClick={this.props.onLogout}>
											<span className="sidebar-mini-icon">Ç</span>
											<span className="sidebar-normal">Çıkış</span>
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<ul className="nav">
						<FirstLevelItem
							name="homePage"
							label="Ana Sayfa"
							isActive={selected === "homePage"}
							show={true}
							icons="fa fa-home fa-fw"
							sidebarItemColor="#6BD098"
							clicked={this.onChangeSelected}/>

						{
							(this.RightExists("ROLE_RIGHT_SELF_READ") && this.props.currentUser.member)
							&&
							<li>
								<a data-toggle="collapse" href="#memberInfoSettings">
									<i className="fas fa-user" style={{color: this.state.activeMenu === "Üyelik Bilgilerim" && "#6BD098"}}/>
									<p style={{color: this.state.activeMenu === "Üyelik Bilgilerim" && "#6BD098"}}>Üyelik Bilgilerim<b className="caret"/></p>
								</a>

								<div className="collapse " id="memberInfoSettings">
									<ul className="nav submenu">

										<li className={selected === "memberInfo" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("memberInfo", "Üyelik Bilgilerim", e)}>
											<Link to={{pathname:'/memberInfo', cities:this.state.cities}}   >
												<i style={{color: this.state.selected === 'memberInfo' && '#6BD098'}} className="fas fa-plus"/>
												<span style={{color: this.state.selected === 'memberInfo' && '#6BD098'}}
													  className="sidebar-normal">Oda Kayıt/İletişim Bilgilerim</span>
											</Link>
										</li>

										{/*<li className={selected === "memberContactInfo" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("memberContactInfo", "İletişim Bilgilerim", e)}>
											<Link to={{pathname:'/memberContactInfo', cities:this.state.cities}}   >
												<i style={{color: this.state.selected === 'memberContactInfo' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'memberContactInfo' && '#6BD098'}}
													  className="sidebar-normal">İletişim Bilgilerim</span>
											</Link>
										</li>*/}

									</ul>
								</div>
							</li>
						}
						{
							(this.RightExists("ROLE_RIGHT_SELF_READ") && this.props.currentUser.member)
							&&
							<li>
								<a data-toggle="collapse" href="#announcementInfoSettings">
									<i className="fas fa-rss" style={{color: this.state.activeMenu === "Duyurular" && "#6BD098"}}/>
									<p style={{color: this.state.activeMenu === "Duyurular" && "#6BD098"}}>Duyurular<b className="caret"/></p>
								</a>

								<div className="collapse " id="announcementInfoSettings">
									<ul className="nav submenu">

										<li className={selected === "announcementList" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("announcementList", "Güncel Duyurular Listesi", e)}>
											<Link to={{pathname:'/announcementMainPage', cities:this.state.cities}}   >
												<i style={{color: this.state.selected === 'announcementList' && '#6BD098'}} className="fas fa-plus"/>
												<span style={{color: this.state.selected === 'announcementList' && '#6BD098'}}
													  className="sidebar-normal">Güncel Duyurular Listesi</span>
											</Link>
										</li>
									</ul>
								</div>
							</li>
						}
						{
							(this.RightExists("ROLE_RIGHT_SELF_READ") && this.props.currentUser.member)
							&&
							<li>
								<a data-toggle="collapse" href="#certificateInfoSettings">
									<i className="fa fa-file" style={{color: this.state.activeMenu === "Belge İndir" && "#6BD098"}}/>
									<p style={{color: this.state.activeMenu === "Belge İndir" && "#6BD098"}}>Belge İndİr<b className="caret"/></p>
								</a>

								<div className="collapse " id="certificateInfoSettings">
									<ul className="nav submenu">

										<li className={selected === "memberCertificatePage" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("memberCertificatePage", "Belge İndir", e)}>
											<Link to={{pathname:'/memberCertificatePage', currentUser:this.props.currentUser}}   >
												<i style={{color: this.state.selected === 'memberCertificatePage' && '#6BD098'}} className="fas fa-plus"/>
												<span style={{color: this.state.selected === 'memberCertificatePage' && '#6BD098'}}
													  className="sidebar-normal">Meslek Mensubu Kimlik Sureti </span>
											</Link>
										</li>
									</ul>
								</div>
							</li>
						}


						{
							(this.RightExists("ROLE_RIGHT_CHAMBER_DOCS_READ"))
							&&
							<li>
								<a data-toggle="collapse" href="#docDownload">
									<i className="fas fa-download" style={{color: this.state.activeMenu === "Birlik Dökümanları" && "#6BD098"}}/>
									<p style={{color: this.state.activeMenu === "Birlik Dökümanları" && "#6BD098"}}>Birlik Dökümanları<b className="caret"/></p>
								</a>

								<div className="collapse " id="docDownload">
									<ul className="nav submenu">

										<li className={selected === "docDownload" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("docDownload", "Birlik Dökümanları", e)}>
											<Link to="/docDownload"  >
												<i style={{color: this.state.selected === 'docDownload' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'docDownload' && '#6BD098'}} className="sidebar-normal">Birlik Döküman Listesi</span>
											</Link>
										</li>
									</ul>
								</div>
							</li>
						}
						{
							(this.RightExists("ROLE_RIGHT_MEMBER_READ"))
							&&
							<li>
								<a data-toggle="collapse" href="#customerSettings">
									<i className="fas fa-users" style={{color: this.state.activeMenu === "Üye İşlemleri" && "#6BD098"}}/>
									<p style={{color: this.state.activeMenu === "Üye İşlemleri" && "#6BD098"}}>Üye İşlemleri<b className="caret"/></p>
								</a>

								<div className="collapse " id="customerSettings">
									<ul className="nav submenu">
										{/*<li className={selected === "member" ? 'active' : ''}
										style={{"paddingLeft": "10px"}}
										onClick={(e) => this.onChangeSelected("member", "Üye İşlemleri", e)}>
										<Link to="/member"  >
											<i style={{color: this.state.selected === 'member' && '#6BD098'}} className="fas fa-plus"/>
											<span style={{color: this.state.selected === 'member' && '#6BD098'}}
												  className="sidebar-normal">Yeni Üye Kaydı</span>
										</Link>
									</li>*/}

										<li className={selected === "memberListReview" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("memberListReview", "Üye İşlemleri", e)}>
											<Link to={{pathname:'/MemberListReview', mode:'review'}} >
												<i style={{color: this.state.selected === 'memberListReview' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'memberListReview' && '#6BD098'}}
													  className="sidebar-normal">Başvuru Onayla</span>
											</Link>
										</li>

										<li className={selected === "memberListApproval" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("memberListApproval", "Üye İşlemleri", e)}>
											<Link to={{pathname:'/MemberListApproval', mode:'approval'}} >
												<i style={{color: this.state.selected === 'memberListApproval' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'memberListApproval' && '#6BD098'}}
													  className="sidebar-normal">Üye Düzenle</span>
											</Link>
										</li>

										<li className={selected === "memberListTransfer" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("memberListTransfer", "Üye İşlemleri", e)}>
											<Link to={{pathname:'/MemberListTransfer', mode:'approval'}} >
												<i style={{color: this.state.selected === 'memberListTransfer' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'memberListTransfer' && '#6BD098'}}
													  className="sidebar-normal">Transfer Kabul</span>
											</Link>
										</li>

										<li className={selected === "changeRequestList" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("changeRequestList", "Üye İşlemleri", e)}>
											<Link to={{pathname:'/changeRequestList', mode:'approval'}} >
												<i style={{color: this.state.selected === 'changeRequestList' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'changeRequestList' && '#6BD098'}}
													  className="sidebar-normal">Üye Bilgi Değişiklik Talepleri</span>
											</Link>
										</li>
										{
											(this.RightExists("ROLE_RIGHT_FINANCIAL_PARAMETERS_CREATE",this.props.authorities))
											&& <li className={selected === "changeRequestList" ? 'active' : ''}
												   style={{"paddingLeft": "10px"}}
												   onClick={(e) => this.onChangeSelected("changeRequestList", "Mail Logları", e)}>
												<Link to={{pathname:'/mailLogs'}} >
													<i style={{color: this.state.selected === 'mailLogs' && '#6BD098'}} className="fas fa-list"/>
													<span style={{color: this.state.selected === 'mailLogs' && '#6BD098'}}
														  className="sidebar-normal">Mail Logları</span>
												</Link>
											</li>
										}
									</ul>
								</div>
							</li>
						}

						{
							(this.RightExists("ROLE_RIGHT_BRANCH_READ"))
							&&
							<li>
								<a data-toggle="collapse" href="#odaSettings">
									<i className="fas fa-university" style={{color: this.state.activeMenu === "Oda İşlemleri" && "#6BD098"}}/>
									<p style={{color: this.state.activeMenu === "Oda İşlemleri" && "#6BD098"}}>Oda İşlemleri<b className="caret"/></p>
								</a>

								<div className="collapse " id="odaSettings">
									<ul className="nav submenu">
										<li className={selected === "odaList" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("odaList", "Oda İşlemleri", e)}>
											<Link to="/odaList"  >
												<i style={{color: this.state.selected === 'odaList' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'odaList' && '#6BD098'}} className="sidebar-normal">Oda Listesi</span>
											</Link>
										</li>

										<li className={selected === "opCertificate" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("opCertificate", "Oda İşlemleri", e)}>
											<Link to="/opCertificate"  >
												<i style={{color: this.state.selected === 'opCertificate' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'opCertificate' && '#6BD098'}} className="sidebar-normal">Belge İşlemleri</span>
											</Link>
										</li>

									</ul>
								</div>
							</li>
						}
						{
							(this.RightExists("ROLE_RIGHT_MEMBER_READ"))
							&&
							<li>
								<a data-toggle="collapse" href="#userSettings">
									<i className="fas fa-user" style={{color: this.state.activeMenu === "Kullanıcı İşlemleri" && "#6BD098"}}/>
									<p style={{color: this.state.activeMenu === "Kullanıcı İşlemleri" && "#6BD098"}}>Kullanıcı İşlemleri<b className="caret"/></p>
								</a>

								<div className="collapse " id="userSettings">
									<ul className="nav submenu">
										<li className={selected === "odaList" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("userList", "Kullanıcı İşlemleri", e)}>
											<Link to="/userList"  >
												<i style={{color: this.state.selected === 'userList' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'userList' && '#6BD098'}} className="sidebar-normal">Kullanıcı Düzenle</span>
											</Link>
										</li>

										{/*<li className={selected === "opCertificate" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("opCertificate", "Kullanıcı İşlemleri", e)}>
											<Link to="/createThumnails"  >
												<i style={{color: this.state.selected === 'opCertificate' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'opCertificate' && '#6BD098'}} className="sidebar-normal">createThumbnails</span>
											</Link>
										</li>*/}

									</ul>
								</div>
							</li>
						}

						{
							(this.RightExists("ROLE_RIGHT_ANNOUNCEMENT_READ"))
							&&
							<li>
								<a data-toggle="collapse" href="#announcementSettings">
									<i className="fas fa-rss" style={{color: this.state.activeMenu === "Duyuru İşlemleri" && "#6BD098"}}/>
									<p style={{color: this.state.activeMenu === "Duyuru İşlemleri" && "#6BD098"}}>Duyuru İşlemleri<b className="caret"/></p>
								</a>

								<div className="collapse " id="announcementSettings">
									<ul className="nav submenu">

										{
											(this.RightExists("ROLE_RIGHT_ANNOUNCEMENT_CREATE"))
											&&
											<li className={selected === "announcementList" ? 'active' : ''}
												style={{"paddingLeft": "10px"}}
												onClick={(e) => this.onChangeSelected("announcementList", "Duyuru İşlemleri", e)}>
												<Link to="/announcementList">
													<i style={{color: this.state.selected === 'announcementList' && '#6BD098'}}
													   className="fas fa-list"/>
													<span
														style={{color: this.state.selected === 'announcementList' && '#6BD098'}}
														className="sidebar-normal">Duyuru Düzenle</span>
												</Link>
											</li>
										}
										<li className={selected === "announcementMainPage" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("announcementMainPage", "Duyuru İşlemleri", e)}>
											<Link to="/announcementMainPage"  >
												<i style={{color: this.state.selected === 'announcementMainPage' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'announcementMainPage' && '#6BD098'}} className="sidebar-normal">Güncel Duyurular Listesi</span>
											</Link>
										</li>

									</ul>
								</div>


							</li>
						}


						{
							(this.RightExists("ROLE_RIGHT_PAYMENT_READ"))
							&&
							<li>
								<a data-toggle="collapse" href="#paymentSettings">
									<i className="fas fa-turkish-lira " style={{color: this.state.activeMenu === "Gelir-Gider İşlemleri" && "#6BD098"}}/>
									<p style={{color: this.state.activeMenu === "Gelir-Gider İşlemleri" && "#6BD098"}}>Gelir - Gider İşlemleri<b className="caret"/></p>
								</a>

								<div className="collapse " id="paymentSettings">
									<ul className="nav submenu">
										<li className={selected === "balance" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("balance", "Gelir-Gider İşlemleri", e)}>
											<Link to="/balance"  >
												<i style={{color: this.state.selected === 'balance' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'balance' && '#6BD098'}} className="sidebar-normal">Bilanço</span>
											</Link>
										</li>

										{this.RightExists("ROLE_RIGHT_FINANCIAL_PARAMETERS_CREATE") &&
											<li className={selected === "accrualStats" ? 'active' : ''}
												style={{"paddingLeft": "10px"}}
												onClick={(e) => this.onChangeSelected("accrualStats", "Gelir-Gider İşlemleri", e)}>
												<Link to="/accrualStats">
													<i style={{color: this.state.selected === 'accrualStats' && '#6BD098'}}
													   className="fas fa-list"/>
													<span
														style={{color: this.state.selected === 'accrualStats' && '#6BD098'}}
														className="sidebar-normal">Aidat İstatistikleri</span>
												</Link>
											</li>
										}

										<li className={selected === "incomeList" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("incomeList", "Gelir-Gider İşlemleri", e)}>
											<Link to="/incomeList"  >
												<i style={{color: this.state.selected === 'incomeList' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'incomeList' && '#6BD098'}} className="sidebar-normal">Gelir İşlemleri</span>
											</Link>
										</li>

										<li className={selected === "paymentList" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("paymentList", "Gelir-Gider İşlemleri", e)}>
											<Link to="/paymentList"  >
												<i style={{color: this.state.selected === 'paymentList' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'paymentList' && '#6BD098'}} className="sidebar-normal">Gider İşlemleri</span>
											</Link>
										</li>


										<li className={selected === "feeList" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("feeList", "Gelir-Gider İşlemleri", e)}>
											<Link to="/accrualList"  >
												<i style={{color: this.state.selected === 'feeList' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'feeList' && '#6BD098'}} className="sidebar-normal">Aidat Tahakkuk İşlemleri</span>
											</Link>
										</li>

										<li className={selected === "receiptList" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("receiptList", "Gelir-Gider İşlemleri", e)}>
											<Link to="/receiptList"  >
												<i style={{color: this.state.selected === 'receiptList' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'receiptList' && '#6BD098'}} className="sidebar-normal">Makbuz İşlemleri</span>
											</Link>
										</li>
										{
										(this.RightExists("ROLE_RIGHT_FINANCIAL_PARAMETERS_CREATE",this.props.authorities))
										&&
										<li className={selected === "financialParameters" ? 'active' : ''}
											style={{"paddingLeft": "10px"}}
											onClick={(e) => this.onChangeSelected("financialParameters", "Gelir-Gider İşlemleri", e)}>
											<Link to="/financialParameters"  >
												<i style={{color: this.state.selected === 'financialParameters' && '#6BD098'}} className="fas fa-list"/>
												<span style={{color: this.state.selected === 'financialParameters' && '#6BD098'}} className="sidebar-normal">Parametre Tanımları</span>
											</Link>
										</li>
										}
									</ul>
								</div>


							</li>
						}





					</ul>

					<ul className="nav" style={{position:"fixed", width:"260px", bottom: "0", zIndex:"100000"}}>
						<li

							// onClick={this.props.onLogout}
							onClick={this.showModal}
							style={{
								fontFamily: "Muli, Helvetica, Arial, sans-serif",
								color: "white",
								fontSize:"14px",
								textAlign: "center",
								background: "#ef767d",
								padding: "11px 0",
								cursor:"pointer"}}>
							ÇIKIŞ
						</li>
					</ul>
					<Modal
						title="Onay"
						visible={this.state.visible}
						okText="Çıkış"
						cancelText="Vazgeç"
						onOk={this.props.onLogout}
						onCancel={this.handleCancel}
						maskClosable={false}
					>
						<p><h4>Çıkmak istediğinizden emin misiniz?</h4></p>

					</Modal>
				</div>
			</div>
		);
	}
}

export default Sidebar;
