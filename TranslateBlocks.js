/*
IDEA 
    motion_gotoxy -> go to x%i y%i -> go to x() y()
    var testVariable = 10 / int testVariable = 10;
    aA-zZ,0-9 ()
    TRUE, FALSE <>
    MENU []
    FUNCTION, for, if, ... {}
    //comment
*/
export default() => {
    const translate = new Map()
    //Motion
    translate.set("motion_movesteps","move steps")
    translate.set("motion_turnright", "turn right")
    translate.set("motion_turnleft", "turn left")
    translate.set("motion_goto", "go to")
    translate.set("motion_gotoxy", "go to xy")
    translate.set("motion_glideto", "glide to")
    translate.set("motion_glidesecstoxy", "glide secs to xy")
    translate.set("motion_pointindirection", "point in direction")
    translate.set("motion_pointtowards", "point towards")
    translate.set("motion_changexby", "change x by")
    translate.set("motion_setx", "set x")
    translate.set("motion_changeyby", "change y by")
    translate.set("motion_sety", "set y")
    translate.set("motion_ifonedgebounce", "if on edge bounce")
    translate.set("motion_setrotationstyle", "set rotation style")
    translate.set("motion_xposition","x position")
    translate.set("motion_yposition","y position")
    translate.set("motion_direction","direction")
    //Looks
    translate.set("looks_sayforsecs","say for secs")
    translate.set("looks_say","say")
    translate.set("looks_thinkforsecs","think for secs")
    translate.set("looks_think","think")
    translate.set("looks_switchcostumeto","switch costume to")
    translate.set("looks_nextcostume","next costume")
    translate.set("looks_switchbackdropto","switch backdrop to")
    translate.set("looks_nextbackdrop","next backdrop")
    translate.set("looks_changesizeby","change size by")
    translate.set("looks_setsizeto","set size to")
    translate.set("looks_changeeffectby","change effect by")
    translate.set("looks_seteffectto","set effect to")
    translate.set("looks_cleargraphiceffects","clear graphic effects")
    translate.set("looks_show","show")
    translate.set("looks_hide","hide")
    translate.set("looks_gotofrontback","go to front back")
    translate.set("looks_goforwardbackwardlayers","go forward backward layers")
    translate.set("looks_costumenumbername","costume number name")
    translate.set("looks_backdropnumbername","backdrop number name")
    translate.set("looks_size","size")
    //sound
    translate.set("sound_playuntildone","play until done")
    translate.set("sound_play","play")
    translate.set("sound_stopallsounds","stop all sounds")
    translate.set("sound_changeeffectby","change effect by")
    translate.set("sound_seteffectto","set effect to")
    translate.set("sound_cleareffects","clear effects")
    translate.set("sound_changevolumeby","change volume by")
    translate.set("sound_setvolumeto","set volume to")
    translate.set("sound_volume","volume")
    //events
    translate.set("event_whenflagclicked","when flag clicked")
    translate.set("event_whenkeypressed","when key pressed")
    translate.set("event_whenthisspriteclicked","when this sprite clicked")
    translate.set("event_whenbackdropswitchesto","when backdrop switches to")
    translate.set("event_whengreaterthan","when greater than")
    translate.set("event_whenbroadcastreceived","when broadcast received")
    translate.set("event_broadcast","broadcast")
    translate.set("event_broadcastandwait","broadcast and wait")
    //controls
    translate.set("control_wait","wait")
    translate.set("control_wait_until","wait until")
    translate.set("control_stop","stop")
    translate.set("control_wait_untilcontrol_stop","wait until")
    translate.set("control_start_as_clone","start as clone")
    translate.set("control_create_clone_of","create clone of")
    translate.set("control_delete_this_clone","delete this clone")
    //Sensing
    translate.set("sensing_askandwait","ask and wait")
    translate.set("sensing_setdragmode","set drag mode")
    translate.set("sensing_resettimer","reset timer")
    translate.set("sensing_touchingobject","touching object")
    translate.set("sensing_touchingcolor","touching color")
    translate.set("sensing_coloristouchingcolor","color is touching color")
    translate.set("sensing_distanceto","distance to")
    translate.set("sensing_answer","answer")
    translate.set("sensing_mousedown","mouse down?")
    translate.set("sensing_mousex","mousex")
    translate.set("sensing_mousey","mousey")
    translate.set("sensing_loudness","loudness")
    translate.set("sensing_timer","timer")
    translate.set("sensing_current","current")
    translate.set("sensing_dayssince2000","days since 2000")
    translate.set("sensing_username","username")
    //math
    translate.set("operator_length","length")
    translate.set("operator_letter_of","letter of")
    translate.set("operator_join","join")
    translate.set("operator_not","not")
    translate.set("operator_round","round")
    //variables
    translate.set("data_setvariableto","set variable to")
    translate.set("data_changevariableby","change variable by")
    translate.set("show variable","show variable")
    translate.set("data_hidevariable","hide variable")
    //lists
    translate.set("data_addtolist","add to list")
    translate.set("data_deleteoflist","delete of list")
    translate.set("data_deletealloflist","delete all of list")
    translate.set("data_insertatlist","insert at list")
    translate.set("data_replaceitemoflist","replace item of list")
    translate.set("data_showlist","show list")
    translate.set("data_hidelist","hide list")
    translate.set("data_itemoflist","item of list")
    //procedures
    /*
    translate.set("motion_movesteps","move")
    translate.set("motion_movesteps","move")
    translate.set("motion_movesteps","move")
    translate.set("motion_movesteps","move")
    translate.set("motion_movesteps","move")
    translate.set("motion_movesteps","move")
    */
    return translate
}


