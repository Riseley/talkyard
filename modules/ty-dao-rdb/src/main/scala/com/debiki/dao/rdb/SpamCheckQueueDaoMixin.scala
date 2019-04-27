/**
 * Copyright (C) 2016, 2019 Kaj Magnus Lindberg
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.debiki.dao.rdb

import com.debiki.core._
import Rdb._
import scala.collection.immutable



trait SpamCheckQueueDaoMixin extends SiteTransaction {
  self: RdbSiteTransaction =>


  def spamCheckPostsSoon(byWho: Who, spamRelReqStuff: SpamRelReqStuff, posts: Post*) {
    posts.foreach(enqueuePost(byWho, spamRelReqStuff, _))
  }


  private def enqueuePost(byWho: Who, spamRelReqStuff: SpamRelReqStuff, post: Post) {
    val languageCode = loadSiteSettings().flatMap(_.languageCode)
    val pageMeta = loadThePageMeta(post.pageId)
    val statement = s"""
      insert into spam_check_queue3 (
        action_at,
        site_id,
        post_id,
        post_rev_nr,
        posted_to_page_id,
        page_published_at,
        user_id,
        browser_id_cookie,
        browser_fingerprint,
        req_user_agent,
        req_referer,
        req_ip,
        req_uri,
        user_name,
        user_email,
        user_trust_level,
        user_url,
        post_content,
        language)
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      -- probably not needed:
      on conflict (site_id, post_id, post_rev_nr) do nothing
      """
    val createdAt = post.currentRevLastEditedAt.getOrElse(post.createdAt)
    val values = List(
      createdAt,
      siteId.asAnyRef,
      post.id.asAnyRef,
      post.currentRevisionNr.asAnyRef,
      post.pageId.asAnyRef,
      pageMeta.publishedAt.orNullTimestamp,
      byWho.id.asAnyRef,
      byWho.idCookie.orNullVarchar,
      byWho.browserFingerprint.asAnyRef,
      spamRelReqStuff.userAgent.orNullVarchar,
      spamRelReqStuff.referer.orNullVarchar,
      byWho.ip,
      spamRelReqStuff.uri,
      spamRelReqStuff.userName,
      spamRelReqStuff.userEmail,
      spamRelReqStuff.userTrustLevel.map(_.toInt).orNullInt,
      spamRelReqStuff.userUrl.orNullVarchar,
      post.currentSource,
      languageCode.orNullVarchar)

    runUpdateSingleRow(statement, values)
  }


  def loadPendingSpamCheckTasksForPost(postId: PostId): immutable.Seq[SpamCheckTask] = {
    val query = s"""
      select * from spam_check_queue3
      where
        site_id = ? and
        post_id = ? and
        misclassifications_reported_at is null
      """
    val values = List(siteId.asAnyRef, postId.asAnyRef)
    runQueryFindMany(query, values, RdbUtil.getSpamCheckTask)
  }


  def updateSpamCheckTaskWithResults(spamCheckTask: SpamCheckTask) {
    val statement = """
      update spam_check_queue3 set
        results_at = ?,
        results_json = ?,
        results_text = ?,
        num_is_spam_results = ?,
        num_not_spam_results = ?,
        human_thinks_is_spam = ?,
        is_misclassified = ?,
        misclassifications_reported_at = ?
      where
        site_id = ? and
        post_id = ? and
        post_rev_nr = ?
      """
    val values = List(
      spamCheckTask.resultAt.orNullTimestamp,
      spamCheckTask.resultJson.orNullJson,
      spamCheckTask.resultText.orNullVarchar,
      spamCheckTask.numIsSpamResults.orNullInt,
      spamCheckTask.numNotSpamResults.orNullInt,
      spamCheckTask.humanSaysIsSpam.orNullBoolean,
      spamCheckTask.isMisclassified.orNullBoolean,
      spamCheckTask.misclassificationsReportedAt.orNullTimestamp,
      spamCheckTask.siteId.asAnyRef,
      spamCheckTask.postId.asAnyRef,
      spamCheckTask.postRevNr.asAnyRef)
    runUpdateSingleRow(statement, values)
  }

}
