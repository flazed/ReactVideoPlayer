import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player'
import { ReactSVG } from 'react-svg'
import classnames from 'classnames';
import { volume_0, volume_50, volume_100, 
         pip, to_fullscreen, out_fullscreen, 
         loop, rewind_back, play, pause, rewind_forward, favorite, main_play } from './icons'
import './videoplayer.scss';

export default function VideoPlayer(props) {
    const [settings, setSettings] = useState({
        playing:        false,
        loop:           false,
        volume:         1,
        muted:          false,
        pip:            false,
        fullscreen:     false,
        isHiddenPanel:  false
    });

    const [videoSettings, setVideoSettings] = useState({
        isMouseDown:    false,
        duration:       0,
        currentTime:    0,
        currentPlayed:  {},
        buffered:       {},
        rewind:         10
    });

    const [isMouseMove, setMouseMove] = useState(true);

    const playerWrapper = useRef();
    const timeHelpTip = useRef();
    const progressBar = useRef();
    let timer = 0;

    useEffect(() => {
        if(settings.fullscreen && !isMouseMove) {
            timer = setTimeout(() => {setSettings({...settings, isHiddenPanel: true})}, 3000);
            return () => clearTimeout(timer);
        } else {      
            clearTimeout(timer);
        }
    }, [isMouseMove, settings.fullscreen]);

    const fullscreenShowPanel = () => {
        let mouseMoveTimer;
        if(settings.fullscreen) {
            if(!isMouseMove) {
                setMouseMove(true);
                setSettings({...settings, isHiddenPanel: false});
            }
            clearTimeout(mouseMoveTimer);
            mouseMoveTimer = setTimeout(() => {setMouseMove(false)}, 500)
        }     
    }

    const toggleFullscreen = () => {      
        if (!document.fullscreenElement) {
            playerWrapper.current.requestFullscreen().catch(err => {
                alert(`Ошибка при включении полноэкранного режима, пожалуйста перезагрузите страницу: ${err.message} (${err.name})`);
            });
            setSettings({...settings, fullscreen: true});
        } else {
            document.exitFullscreen();
            setSettings({...settings, fullscreen: false});
        }
    }

    const setDuration = (dur) => {
        setVideoSettings({...videoSettings, duration: dur});
    }

    const videoProgress = (progress) => {
        setVideoSettings({...videoSettings, currentPlayed:  { width : progress.played*100+"%" },
                                            buffered:       { width : progress.loaded*100+"%" },
                                            currentTime:    progress.playedSeconds});
    }

    const changeCurrentTime = (e) => {
        const video = document.querySelector(".react-player video");

        const width = progressBar.current.offsetWidth;
        const x = e.pageX - progressBar.current.offsetLeft;
        const newTime = x/(width/videoSettings.duration);

        video.currentTime = newTime;
    }

    const setTimeTip = (e) => {
        const video = document.querySelector(".react-player video");

        const width = progressBar.current.offsetWidth;
        const x = e.pageX - progressBar.current.offsetLeft < 0 ? 0 : e.pageX - progressBar.current.offsetLeft;
        const newTime = x/(width/videoSettings.duration);

        timeHelpTip.current.style.left = `${x}px`;
        timeHelpTip.current.textContent = getFormatTime(newTime);
        
        videoSettings.isMouseDown && (video.currentTime = newTime);
    }

    const keyboardControl = (e) => {
        e.preventDefault();
        switch(e.code) {
            case "ArrowLeft":   rewindTime(-videoSettings.rewind); break;
            case "ArrowRight":  rewindTime(videoSettings.rewind); break;
            case "ArrowUp":     setSettings({...settings, volume: settings.volume+0.1 > 1 ? 1 : settings.volume+0.1}); break;
            case "ArrowDown":   setSettings({...settings, volume: settings.volume-0.1 < 0 ? 0 : settings.volume-0.1}); break;
            case "Space":       setSettings({...settings, playing: !settings.playing}); break;
            case "KeyF" :       toggleFullscreen(); break;
            case "KeyM" :       setSettings({...settings, muted: !settings.muted}); break;
            default: break;
        }
    }

    const rewindTime = (sec) => {
        const video = document.querySelector(".react-player div video");
        video.currentTime = video.currentTime + sec;
    }

    const getFormatTime = (sec) => {
        return new Date(sec*1000).toUTCString().split(/ /)[4];
    }

    const handleChange = (e) => {
        setSettings({...settings, volume: +e.target.value});
        if(settings.muted) {
            setSettings({...settings, muted: false});
        }
    }

    return (
        <div ref={playerWrapper} 
            tabIndex="1"
            className={classnames("react-player", {"hiddenControls" : settings.isHiddenPanel, "fullscreen" : settings.fullscreen})}
            onKeyDown={keyboardControl.bind(this)}
            onMouseMove={fullscreenShowPanel.bind(this)}
            onMouseUp={() => setVideoSettings({...videoSettings, isMouseDown: false})}>            

            <div className="playerOverlay" onClick={setSettings.bind(this, {...settings, playing: !settings.playing})} onDoubleClick={toggleFullscreen.bind(this)} >
                {
                    !settings.playing &&
                        <div className="overyalPlayPause">
                            <ReactSVG src={main_play}/>
                        </div>
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

                    onPlay={setSettings.bind(this, {...settings, playing: true})}
                    onPause={setSettings.bind(this, {...settings, playing: false})}

                    onEnablePIP={setSettings.bind(this, {...settings, pip: true})}
                    onDisablePIP={setSettings.bind(this, {...settings, pip: false})}

                    onDuration={(dur) => setDuration(dur)}
                    onProgress={(progress) => videoProgress(progress)}
                />
            </div>

            <div className="playerMenu">
                <div className="playerControls flex-center">
                    <button className = {classnames("controlRepeat", {"active" : settings.loop})} onClick={setSettings.bind(this, {...settings, loop: !settings.loop})}>
                        <ReactSVG src={loop}/>
                    </button>

                    <button className="controlBack" onClick={rewindTime.bind(this, -videoSettings.rewind)}>
                        <ReactSVG src={rewind_back}/>
                    </button>
                                            
                    <button className='play_pause flex-center' onClick={setSettings.bind(this, {...settings, playing: !settings.playing})}>
                        { settings.playing ? <ReactSVG src={pause}/> : <ReactSVG src={play}/> }
                    </button>

                    <button className="controlForward" onClick={rewindTime.bind(this, videoSettings.rewind)}>
                        <ReactSVG src={rewind_forward}/>
                    </button>

                    <button className="controlLike">
                        <ReactSVG src={favorite}/>
                    </button>
                </div>

                <div className="playerProgress flex-center">
                    <div className="screenControl flex-center">
                        <button onClick={toggleFullscreen.bind(this)}>
                            { settings.fullscreen ? <ReactSVG src={out_fullscreen}/> : <ReactSVG src={to_fullscreen}/> }
                        </button>

                        <button className={classnames({"active" : settings.pip})} onClick={setSettings.bind(this, {...settings, pip: !settings.pip})}>
                            <ReactSVG src={pip}/>
                        </button>
                    </div>

                    <div className="lineProgress flex-center">
                        <span id="currentTime">{getFormatTime(videoSettings.currentTime)}</span>

                        <div ref={progressBar} className="progress flex-center" onClick={changeCurrentTime.bind(this)} 
                                                                                onMouseDown={() => {
                                                                                    setSettings({...settings, playing: false})
                                                                                    setVideoSettings({...videoSettings, isMouseDown: true})} 
                                                                                }
                                                                                onMouseUp={() => {
                                                                                    setSettings({...settings, playing: true})
                                                                                    setVideoSettings({...videoSettings, isMouseDown: false})} 
                                                                                }
                                                                                onMouseMove={setTimeTip.bind(this)}>
                            <div className="timeTip" ref={timeHelpTip}>00:00:00</div>
                            <div className="currentTime flex-center" style={videoSettings.currentPlayed}> <div className="circlePoint"></div> </div>
                            <div className="bufferedVideo" style={videoSettings.buffered}></div>
                        </div>

                        <span id="totalDuration">{getFormatTime(videoSettings.duration)}</span>
                    </div>

                    <div className="volumeControl flex-center">
                        <button onClick={setSettings.bind(this, {...settings, muted: !settings.muted})}>
                            { settings.muted || settings.volume === 0 ?
                                <ReactSVG src={volume_0}/> : settings.volume < 0.5 ? 
                                    <ReactSVG src={volume_50}/> : <ReactSVG src={volume_100}/>                                                                                          
                            }
                        </button>
                        <input type="range" min="0" max="1" step="any" value={settings.muted ? 0 : settings.volume} onChange={handleChange.bind(this)}/>
                    </div>
                </div>
            </div>
        </div>
    );
}