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
        currentTime: 0
    });

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
        let video = document.querySelector(".react-player div video");
        console.log(progress);

        if(progress.playedSeconds.toFixed(0) == 10) {
            video.currentTime = 30;
        }

        document.querySelector("#currentTime").textContent = getFormatTime(progress.playedSeconds);
    }

    function getFormatTime(sec) {
        return new Date(sec*1000).toUTCString().split(/ /)[4];
    }

    return (
        <div className="react-player">
            <ReactPlayer 
                url={props.url}
                width='100%'
                height='85vh'
                controls={false}
                playing={settings.playing}
                loop={settings.loop}
                pip={settings.pip}

                onPlay={() => setSettings({...settings, playing: true})}
                onPause={() => setSettings({...settings, playing: false})}

                onEnablePIP={() => setSettings({...settings, pip: true})}
                onDisablePIP={() => setSettings({...settings, pip: false})}

                onDuration={(dur) => setDuration(dur)}
                onProgress={(progress) => videoProgress(progress)}
            />

            <div className="playerMenu">
                <div className="playerControls flex-center">
                    <button className = {settings.loop ? "controlRepeat active" : "controlRepeat"} onClick={() => setSettings({...settings, loop: !settings.loop})}>
                        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 3.77778H9.09091C9.59273 3.77778 10 3.37956 10 2.88889C10 2.39822 9.59273 2 9.09091 2H5C2.24318 2 0 4.19333 0 6.88889C0 9.58444 2.24318 11.7778 5 11.7778H6.89636L6.17546 12.4827C5.82046 12.8298 5.82046 13.3924 6.17546 13.7396C6.35318 13.9133 6.58545 14 6.81818 14C7.05091 14 7.28318 13.9133 7.46091 13.7396L9.73364 11.5173C10.0886 11.1702 10.0886 10.6076 9.73364 10.2604L7.46091 8.03822C7.10591 7.69111 6.53046 7.69111 6.17546 8.03822C5.82046 8.38533 5.82046 8.948 6.17546 9.29511L6.89636 10H5C3.24591 10 1.81818 8.604 1.81818 6.88889C1.81818 5.17333 3.24591 3.77778 5 3.77778Z" />
                            <path d="M17 2.22213H15.1036L15.8245 1.51724C16.1795 1.17012 16.1795 0.60745 15.8245 0.260336C15.4695 -0.0867786 14.8941 -0.0867786 14.5391 0.260336L12.2664 2.48258C11.9114 2.82969 11.9114 3.39236 12.2664 3.73948L14.5391 5.96172C14.7168 6.1355 14.9491 6.22217 15.1818 6.22217C15.4145 6.22217 15.6468 6.1355 15.8245 5.96172C16.1795 5.61461 16.1795 5.05194 15.8245 4.70482L15.1036 3.99993H17C18.7541 3.99993 20.1818 5.39549 20.1818 7.11107C20.1818 8.82619 18.7541 10.2222 17 10.2222H12.9091C12.4073 10.2222 12 10.6204 12 11.1111C12 11.6018 12.4073 12 12.9091 12H17C19.7568 12 22 9.80665 22 7.11107C22 4.41548 19.7568 2.22213 17 2.22213Z" />
                        </svg>
                    </button>

                    <button className="controlBack">
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

                    <button className="controlForward">
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
                                <g clipPath="url(#clip0)">
                                    <path d="M5.11364 0H4.43183C4.24339 0 4.09091 0.152482 4.09091 0.34092V4.09091H0.34092C0.152482 4.09091 0 4.24339 0 4.43183V5.11364C0 5.30208 0.152482 5.45456 0.34092 5.45456H5.11364C5.30208 5.45456 5.45456 5.30208 5.45456 5.11364V0.34092C5.45456 0.152482 5.30208 0 5.11364 0Z"/>
                                    <path d="M14.6591 4.09091H10.9091V0.34092C10.9091 0.152482 10.7566 0 10.5682 0H9.88639C9.69795 0 9.54547 0.152482 9.54547 0.34092V5.11364C9.54547 5.30208 9.69795 5.45456 9.88639 5.45456H14.6591C14.8475 5.45456 15 5.30208 15 5.11364V4.43183C15 4.24339 14.8475 4.09091 14.6591 4.09091Z"/>
                                    <path d="M14.6591 9.54547H9.88633C9.69789 9.54547 9.54541 9.69795 9.54541 9.88639V14.6591C9.54541 14.8475 9.69789 15 9.88633 15H10.5681C10.7566 15 10.9091 14.8475 10.9091 14.6591V10.9091H14.659C14.8475 10.9091 14.9999 10.7566 14.9999 10.5682V9.88636C14.9999 9.69792 14.8475 9.54547 14.6591 9.54547Z"/>
                                    <path d="M5.11364 9.54547H0.34092C0.152482 9.54547 0 9.69792 0 9.88636V10.5682C0 10.7566 0.152482 10.9091 0.34092 10.9091H4.09091V14.6591C4.09091 14.8475 4.24339 15 4.43183 15H5.11364C5.30208 15 5.45456 14.8475 5.45456 14.6591V9.88636C5.45456 9.69792 5.30208 9.54547 5.11364 9.54547Z"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                    <rect width="15" height="15" fill="white"/>
                                    </clipPath>
                                </defs>
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
                        <span id="currentTime">0:00</span>

                        <div className="progress">
                            
                        </div>

                        <span id="totalDuration">0:00</span>
                    </div>

                    <div className="volumeControl flex-center">
                        
                    </div>
                </div>
            </div>
        </div>
    );
}