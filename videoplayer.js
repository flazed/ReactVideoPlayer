import './videoplayer.scss';
import React, {useState} from 'react';
import ReactPlayer from 'react-player'

export default function VideoPlayer(props) {
    
    const [settings, setSettings] = useState({
        playing: false,
        loop: false,
        volume: 1,
        muted: false,
        pip: false,
        fullscreen: false,
        duration: 0,
        currentTime: 0,
        rewind: 10
    });

    // document.querySelector('.react-player').addEventListener('onkeydown', (e) => keyboardControl(e));

    function toggleFullscreen() {
        let elem = document.querySelector(".react-player");
      
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            elem.classList.add("fullscreen");
            setSettings({...settings, fullscreen: true});


        } else {
            document.exitFullscreen();
            elem.classList.remove("fullscreen");
            setSettings({...settings, fullscreen: false});
        }
    }

    function setDuration(dur) {
        setSettings({...settings, duration: dur});
        document.querySelector("#totalDuration").textContent = getFormatTime(dur);
    }

    function videoProgress(progress) {
        // console.log(progress);
        document.querySelector(".currentTime").style.width = progress.played*100+"%";
        document.querySelector(".bufferedVideo").style.width = progress.loaded*100+"%";
        document.querySelector("#currentTime").textContent = getFormatTime(progress.playedSeconds);
    }

    function changeCurrentTime(e) {
        let progressBar = e.target.closest(".progress");
        let video = document.querySelector(".react-player div video");

        let width = progressBar.offsetWidth;
        let x = e.pageX - progressBar.offsetLeft;
        let newTime = x/(width/settings.duration);
        video.currentTime = newTime;
    }

    function timeTip(e) {
        let progressBar = e.target.closest(".progress");
        let width = progressBar.offsetWidth;
        let timeTipElem = document.querySelector(".timeTip");
        let x = e.pageX - progressBar.offsetLeft < 0 ? 0 : e.pageX - progressBar.offsetLeft;
        let newTime = x/(width/settings.duration);

        timeTipElem.style.left = `${x}px`;
        timeTipElem.textContent = getFormatTime(newTime);
    }

    function keyboardControl(e) {
        e.preventDefault();
        if(e.code === "ArrowLeft") {
            rewindTime(-settings.rewind);
        } else if(e.code === "ArrowRight"){
            rewindTime(settings.rewind);
        } else if(e.code === "ArrowUp"){
            setSettings({...settings, volume: settings.volume+0.1 > 1 ? 1 : settings.volume+0.1});
        } else if(e.code === "ArrowDown"){
            setSettings({...settings, volume: settings.volume-0.1 < 0 ? 0 : settings.volume-0.1});
        } else if(e.code === "Space") {
            setSettings({...settings, playing: !settings.playing});
        } else if(e.code === "KeyF") {
            toggleFullscreen();
        } else if(e.code === "KeyM") {
            setSettings({...settings, muted: !settings.muted});
        }
    }

    function rewindTime(sec) {
        let video = document.querySelector(".react-player div video");
        video.currentTime = video.currentTime + sec;
    }

    function getFormatTime(sec) {
        return new Date(sec*1000).toUTCString().split(/ /)[4];
    }

    function handleChange(e) {
        setSettings({...settings, volume: +e.target.value});
        if(settings.muted) {
            setSettings({...settings, muted: false});
        }
    }

    return (
        <div className="react-player" tabIndex="1" onKeyDown={(e) => keyboardControl(e)}>
            <div className="playerOverlay" onClick={() => setSettings({...settings, playing: !settings.playing})} onDoubleClick={() => toggleFullscreen()}>
                {
                    !settings.playing ? 
                        <div className="overyalPlayPause">
                            <svg width="62" height="80" viewBox="0 0 62 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M56.6132 32.5713L12.1763 2.14996C10.1242 0.744069 8.05645 0 6.33778 0C3.01505 0 0.959632 2.66673 0.959632 7.1305V72.8799C0.959632 77.3384 3.01246 80 6.32741 80C8.04868 80 10.0834 79.2553 12.1401 77.8455L56.5977 47.4248C59.4567 45.4652 61.0401 42.8283 61.0401 39.9964C61.0407 37.1665 59.4755 34.5302 56.6132 32.5713Z" fill="white"/>
                            </svg>
                        </div> : ""
                }

                <ReactPlayer 
                    url={props.url}
                    width='100%'
                    height='100%'
                    controls={false}
                    playing={settings.playing}
                    loop={settings.loop}
                    pip={settings.pip}
                    volume={settings.volume}
                    muted={settings.muted}
                    progressInterval={100}

                    onPlay={() => setSettings({...settings, playing: true})}
                    onPause={() => setSettings({...settings, playing: false})}

                    onEnablePIP={() => setSettings({...settings, pip: true})}
                    onDisablePIP={() => setSettings({...settings, pip: false})}

                    onDuration={(dur) => setDuration(dur)}
                    onProgress={(progress) => videoProgress(progress)}
                />
            </div>

            <div className="playerMenu">
                <div className="playerControls flex-center">
                    <button className = {settings.loop ? "controlRepeat active" : "controlRepeat"} onClick={() => setSettings({...settings, loop: !settings.loop})}>
                        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 3.77778H9.09091C9.59273 3.77778 10 3.37956 10 2.88889C10 2.39822 9.59273 2 9.09091 2H5C2.24318 2 0 4.19333 0 6.88889C0 9.58444 2.24318 11.7778 5 11.7778H6.89636L6.17546 12.4827C5.82046 12.8298 5.82046 13.3924 6.17546 13.7396C6.35318 13.9133 6.58545 14 6.81818 14C7.05091 14 7.28318 13.9133 7.46091 13.7396L9.73364 11.5173C10.0886 11.1702 10.0886 10.6076 9.73364 10.2604L7.46091 8.03822C7.10591 7.69111 6.53046 7.69111 6.17546 8.03822C5.82046 8.38533 5.82046 8.948 6.17546 9.29511L6.89636 10H5C3.24591 10 1.81818 8.604 1.81818 6.88889C1.81818 5.17333 3.24591 3.77778 5 3.77778Z" />
                            <path d="M17 2.22213H15.1036L15.8245 1.51724C16.1795 1.17012 16.1795 0.60745 15.8245 0.260336C15.4695 -0.0867786 14.8941 -0.0867786 14.5391 0.260336L12.2664 2.48258C11.9114 2.82969 11.9114 3.39236 12.2664 3.73948L14.5391 5.96172C14.7168 6.1355 14.9491 6.22217 15.1818 6.22217C15.4145 6.22217 15.6468 6.1355 15.8245 5.96172C16.1795 5.61461 16.1795 5.05194 15.8245 4.70482L15.1036 3.99993H17C18.7541 3.99993 20.1818 5.39549 20.1818 7.11107C20.1818 8.82619 18.7541 10.2222 17 10.2222H12.9091C12.4073 10.2222 12 10.6204 12 11.1111C12 11.6018 12.4073 12 12.9091 12H17C19.7568 12 22 9.80665 22 7.11107C22 4.41548 19.7568 2.22213 17 2.22213Z" />
                        </svg>
                    </button>

                    <button className="controlBack" onClick={() => rewindTime(-settings.rewind)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.244658 8.51593L7.578 14.5159C7.77666 14.6793 8.05266 14.7126 8.286 14.6026C8.518 14.4919 8.66666 14.2572 8.66666 13.9999L8.66666 9.40659L14.9113 14.5159C15.1107 14.6793 15.386 14.7126 15.6193 14.6026C15.8513 14.4919 16 14.2572 16 13.9999L16 1.99994C16 1.74259 15.8513 1.50794 15.6193 1.39728C15.528 1.35462 15.43 1.33328 15.3333 1.33328C15.182 1.33328 15.0327 1.38462 14.9113 1.48394L8.66669 6.59328L8.66669 1.99994C8.66669 1.74259 8.51803 1.50793 8.28603 1.39728C8.19469 1.35462 8.09669 1.33328 8.00003 1.33328C7.84869 1.33328 7.69938 1.38462 7.57803 1.48394L0.244689 7.48393C0.0900322 7.61059 3.30252e-05 7.79993 3.30078e-05 7.99993C3.29903e-05 8.19993 0.0900017 8.38925 0.244658 8.51593Z" />
                        </svg>
                    </button>
                                            
                    <button className='play_pause flex-center' onClick={() => setSettings({...settings, playing: !settings.playing})}>
                        { settings.playing ?
                        <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="4" height="15" rx="2" fill="white"/>
                            <rect x="8" width="4" height="15" rx="2" fill="white"/>
                        </svg>
                        :
                        <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.3025 6.10712L2.97057 0.403118C2.58578 0.139513 2.19809 0 1.87583 0C1.25282 0 0.867432 0.500012 0.867432 1.33697V13.665C0.867432 14.501 1.25234 15 1.87389 15C2.19663 15 2.57813 14.8604 2.96377 14.596L11.2996 8.89215C11.8356 8.52473 12.1325 8.03031 12.1325 7.49933C12.1326 6.96872 11.8392 6.47442 11.3025 6.10712Z" fill="white"/>
                        </svg> 
                        }
                    </button>

                    <button className="controlForward" onClick={() => rewindTime(settings.rewind)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.7553 7.48406L8.422 1.48406C8.22334 1.32072 7.94734 1.28741 7.714 1.39741C7.482 1.50806 7.33334 1.74275 7.33334 2.00006V6.59341L1.08866 1.48406C0.889313 1.32072 0.614 1.28741 0.380656 1.39741C0.148656 1.50806 0 1.74275 0 2.00006V14.0001C0 14.2574 0.148656 14.4921 0.380656 14.6027C0.472 14.6454 0.57 14.6667 0.666656 14.6667C0.818 14.6667 0.967313 14.6154 1.08866 14.5161L7.33331 9.40672V14.0001C7.33331 14.2574 7.48197 14.4921 7.71397 14.6027C7.80531 14.6454 7.90331 14.6667 7.99997 14.6667C8.15131 14.6667 8.30062 14.6154 8.42197 14.5161L15.7553 8.51606C15.91 8.38941 16 8.20006 16 8.00006C16 7.80006 15.91 7.61075 15.7553 7.48406Z" />
                        </svg>
                    </button>

                    <button className="controlLike">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.7307 2.26807C13.9025 1.36975 12.766 0.875 11.5304 0.875C10.6068 0.875 9.76099 1.16699 9.01636 1.7428C8.64062 2.03345 8.30017 2.38904 8 2.80408C7.69995 2.38916 7.35938 2.03345 6.98352 1.7428C6.23901 1.16699 5.39319 0.875 4.4696 0.875C3.23401 0.875 2.09741 1.36975 1.26917 2.26807C0.450806 3.15588 0 4.36877 0 5.68347C0 7.03662 0.504272 8.27527 1.58691 9.58167C2.55542 10.7502 3.94739 11.9365 5.55933 13.3102C6.10974 13.7793 6.73364 14.311 7.38147 14.8774C7.55261 15.0273 7.77222 15.1099 8 15.1099C8.22766 15.1099 8.44739 15.0273 8.61829 14.8777C9.26611 14.3112 9.89038 13.7792 10.441 13.3098C12.0527 11.9364 13.4447 10.7502 14.4132 9.58154C15.4958 8.27527 16 7.03662 16 5.68335C16 4.36877 15.5492 3.15588 14.7307 2.26807Z" />
                        </svg>
                    </button>
                </div>

                <div className="playerProgress flex-center">
                    <div className="screenControl flex-center">
                        <button onClick={() => toggleFullscreen()}>
                            { !settings.fullscreen ?
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.624962 5.00004C0.970573 5.00004 1.25004 4.72057 1.25004 4.37496V1.875C1.25004 1.52996 1.52996 1.25004 1.875 1.25004H4.37496C4.72057 1.25004 5.00004 0.970573 5.00004 0.624962C5.00004 0.27935 4.72057 0 4.37496 0H1.875C0.841255 0 0 0.841255 0 1.875V4.37496C0 4.72057 0.27935 5.00004 0.624962 5.00004Z"/>
                                <path d="M14.375 9.99994C14.0294 9.99994 13.75 10.2794 13.75 10.625V13.125C13.75 13.47 13.47 13.7499 13.125 13.7499H10.625C10.2794 13.7499 9.99997 14.0294 9.99997 14.375C9.99997 14.7206 10.2794 15 10.625 15H13.125C14.1588 15 15 14.1587 15 13.125V10.625C15 10.2794 14.7207 9.99994 14.375 9.99994Z" />
                                <path d="M4.37496 13.7499H1.875C1.52996 13.7499 1.25004 13.47 1.25004 13.125V10.625C1.25004 10.2794 0.970573 9.99994 0.624962 9.99994C0.27935 9.99994 0 10.2794 0 10.625V13.125C0 14.1587 0.841255 15 1.875 15H4.37496C4.72057 15 5.00004 14.7206 5.00004 14.375C5.00004 14.0294 4.72057 13.7499 4.37496 13.7499Z" />
                                <path d="M13.125 0H10.625C10.2794 0 9.99997 0.27935 9.99997 0.624962C9.99997 0.970573 10.2794 1.25004 10.625 1.25004H13.125C13.47 1.25004 13.75 1.52996 13.75 1.875V4.37496C13.75 4.72057 14.0294 5.00004 14.375 5.00004C14.7207 5.00004 15 4.72057 15 4.37496V1.875C15 0.841255 14.1588 0 13.125 0Z"/>
                            </svg>
                            :
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path d="M5.11364 0H4.43183C4.24339 0 4.09091 0.152482 4.09091 0.34092V4.09091H0.34092C0.152482 4.09091 0 4.24339 0 4.43183V5.11364C0 5.30208 0.152482 5.45456 0.34092 5.45456H5.11364C5.30208 5.45456 5.45456 5.30208 5.45456 5.11364V0.34092C5.45456 0.152482 5.30208 0 5.11364 0Z"/>
                                    <path d="M14.6591 4.09091H10.9091V0.34092C10.9091 0.152482 10.7566 0 10.5682 0H9.88639C9.69795 0 9.54547 0.152482 9.54547 0.34092V5.11364C9.54547 5.30208 9.69795 5.45456 9.88639 5.45456H14.6591C14.8475 5.45456 15 5.30208 15 5.11364V4.43183C15 4.24339 14.8475 4.09091 14.6591 4.09091Z"/>
                                    <path d="M14.6591 9.54547H9.88633C9.69789 9.54547 9.54541 9.69795 9.54541 9.88639V14.6591C9.54541 14.8475 9.69789 15 9.88633 15H10.5681C10.7566 15 10.9091 14.8475 10.9091 14.6591V10.9091H14.659C14.8475 10.9091 14.9999 10.7566 14.9999 10.5682V9.88636C14.9999 9.69792 14.8475 9.54547 14.6591 9.54547Z"/>
                                    <path d="M5.11364 9.54547H0.34092C0.152482 9.54547 0 9.69792 0 9.88636V10.5682C0 10.7566 0.152482 10.9091 0.34092 10.9091H4.09091V14.6591C4.09091 14.8475 4.24339 15 4.43183 15H5.11364C5.30208 15 5.45456 14.8475 5.45456 14.6591V9.88636C5.45456 9.69792 5.30208 9.54547 5.11364 9.54547Z"/>
                                </g>
                            </svg>
                            }
                        </button>

                        <button className={settings.pip ? "active" : ""} onClick={() => setSettings({...settings, pip: !settings.pip})}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5 6.41667H11C10.4959 6.41667 10.0834 6.82917 10.0834 7.33333V11C10.0834 11.5042 10.4959 11.9167 11 11.9167H16.5C17.0042 11.9167 17.4167 11.5042 17.4167 11V7.33333C17.4167 6.82917 17.0042 6.41667 16.5 6.41667ZM19.25 2.75H2.75002C1.74169 2.75 0.916687 3.575 0.916687 4.58333V17.4167C0.916687 18.425 1.74169 19.2317 2.75002 19.2317H19.25C20.2584 19.2317 21.0834 18.425 21.0834 17.4167V4.58333C21.0834 3.575 20.2584 2.75 19.25 2.75ZM18.3334 17.4258H3.66669C3.16252 17.4258 2.75002 17.0133 2.75002 16.5092V5.48167C2.75002 4.9775 3.16252 4.565 3.66669 4.565H18.3334C18.8375 4.565 19.25 4.9775 19.25 5.48167V16.5092C19.25 17.0133 18.8375 17.4258 18.3334 17.4258V17.4258Z"/>
                            </svg>
                        </button>
                    </div>

                    <div className="lineProgress flex-center">
                        <span id="currentTime">00:00:00</span>

                        <div className="progress flex-center" onClick={(e) => changeCurrentTime(e)} onMouseMove={(e) => (timeTip(e))}>
                            <div className="timeTip">00:00:00</div>
                            <div className="currentTime flex-center"> <div className="circlePoint"></div> </div>
                            <div className="bufferedVideo"></div>
                        </div>

                        <span id="totalDuration">00:00:00</span>
                    </div>

                    <div className="volumeControl flex-center">
                        <button onClick={() => setSettings({...settings, muted: !settings.muted})}>
                            { settings.muted || settings.volume === 0 ?
                                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d="M14.7124 0.825546C14.7124 0.513455 14.5182 0.21779 14.2181 0.0863836C13.9004 -0.0614488 13.5473 -0.0121714 13.2825 0.184939L5.4624 5.98325L14.7124 14.5904V0.825546V0.825546Z"/>
                                        <path d="M19.4712 21.5972L1.71313 4C1.39283 3.6797 0.872133 3.6797 0.551829 4C0.231526 4.3203 0.231526 4.841 0.551829 5.16131L1.71319 6.5L1.64258 6.57421C1.13338 6.57421 0.689884 6.80417 0.394219 7.16554C0.147832 7.44478 0 7.82257 0 8.21679V14.7871C0 15.6905 0.739162 16.4297 1.64258 16.4297H5.45337L13.4527 22.8193C13.6006 22.9343 13.7813 23 13.9619 23C14.0769 23 14.2083 22.9672 14.3233 22.9179C14.6025 22.7865 14.7832 22.4908 14.7832 22.1787V19.2336L18.3082 22.7586C18.4692 22.9195 18.6794 23 18.8897 23C19.0999 23 19.3102 22.9195 19.4712 22.7602C19.7915 22.4382 19.7915 21.9192 19.4712 21.5972Z"/>
                                    </g>
                                </svg>
                                : settings.volume < 0.5 ? 
                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path d="M14.3202 0.0817612C14.0343 -0.0545902 13.6976 -0.0184489 13.4511 0.180328L5.46063 6.57241H1.64279C0.737611 6.57241 0 7.31003 0 8.2152V14.7864C0 15.6932 0.737611 16.4291 1.64279 16.4291H5.46063L13.4495 22.8212C13.599 22.9395 13.7813 23.0003 13.9637 23.0003C14.0853 23.0003 14.2068 22.9724 14.3202 22.9181C14.6044 22.7818 14.7851 22.4943 14.7851 22.1789V0.822658C14.7851 0.507243 14.6044 0.219755 14.3202 0.0817612Z"/>
                                            <path d="M19.7649 5.69158C19.4413 5.37287 18.9221 5.3778 18.6034 5.69815C18.2847 6.02178 18.288 6.5409 18.61 6.86124C19.852 8.08676 20.5353 9.73448 20.5353 11.5005C20.5353 13.2665 19.852 14.9142 18.61 16.1397C18.288 16.4568 18.2847 16.9775 18.6034 17.3012C18.7644 17.4638 18.9763 17.5443 19.1866 17.5443C19.3953 17.5443 19.6039 17.4654 19.7649 17.3061C21.3222 15.7734 22.1781 13.71 22.1781 11.5005C22.1781 9.29093 21.3222 7.22758 19.7649 5.69158Z"/>
                                        </g>
                                    </svg> :
                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path d="M17.681 6.07854C17.3789 5.78107 16.8944 5.78567 16.5969 6.08467C16.2995 6.38674 16.3025 6.87127 16.6031 7.17027C17.7623 8.31414 18.4001 9.85207 18.4001 11.5004C18.4001 13.1487 17.7623 14.6867 16.6031 15.8305C16.3025 16.1265 16.2995 16.6125 16.5969 16.9146C16.7472 17.0664 16.945 17.1415 17.1413 17.1415C17.336 17.1415 17.5307 17.0679 17.681 16.9192C19.1346 15.4886 19.9335 13.5627 19.9335 11.5004C19.9335 9.43807 19.1346 7.5122 17.681 6.07854Z"/>
                                            <path d="M19.8443 3.91809C19.5423 3.61909 19.0577 3.62216 18.7587 3.92269C18.4613 4.22322 18.4643 4.70929 18.7633 5.00676C20.5067 6.73482 21.4666 9.04096 21.4666 11.5004C21.4666 13.9599 20.5067 16.2645 18.7633 17.9926C18.4643 18.2916 18.4613 18.7776 18.7587 19.0782C18.9105 19.2284 19.1068 19.3036 19.3031 19.3036C19.4978 19.3036 19.6941 19.23 19.8443 19.0812C21.8806 17.0649 22.9999 14.3724 22.9999 11.5004C22.9999 8.62849 21.8806 5.93596 19.8443 3.91809Z"/>
                                            <path d="M14.3202 0.0817612C14.0343 -0.0545902 13.6976 -0.0184489 13.4511 0.180328L5.46063 6.57241H1.64279C0.737611 6.57241 0 7.31003 0 8.2152V14.7864C0 15.6932 0.737611 16.4291 1.64279 16.4291H5.46063L13.4495 22.8212C13.599 22.9395 13.7813 23.0003 13.9637 23.0003C14.0853 23.0003 14.2068 22.9724 14.3202 22.9181C14.6044 22.7818 14.7851 22.4943 14.7851 22.1789V0.822658C14.7851 0.507243 14.6044 0.219755 14.3202 0.0817612Z"/>
                                        </g>
                                    </svg>                                                                                           
                                }
                        </button>
                        <input type="range" min="0" max="1" step="any" value={settings.volume} onChange={(e) => handleChange(e)}/>
                    </div>
                </div>
            </div>
        </div>
    );
}