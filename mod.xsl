<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/root" name="wurui.imgplayer">
        <!-- className 'J_OXMod' required  -->
        <xsl:variable name="imgs" select="data/imgplayer/i"/>
        <div class="J_OXMod oxmod-imgplayer" data-src="asset/test.png" data-index="1" ox-mod="imgplayer">
            <div class="img-box J_box">
                <xsl:for-each select="$imgs">
                    <span data-text="{text}" style="background-image:url({src})" class="img-item">
                    </span>
                </xsl:for-each>
            </div>
            <div class="img-desc J_desc">
                <label class="desc-index"><em class="J_desc_index">1</em>/<xsl:value-of select="count($imgs)"/></label>
                <div class="J_desc_text desc-text">
                    <xsl:value-of select="$imgs[position()=1]/text"/>
                </div>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>
